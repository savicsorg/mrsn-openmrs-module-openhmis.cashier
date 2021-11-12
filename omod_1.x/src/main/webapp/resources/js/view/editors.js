/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and
 * limitations under the License.
 *
 * Copyright (C) OpenHMIS.  All Rights Reserved.
 */
define(
    [
            openhmis.url.backboneBase + 'js/lib/backbone',
            openhmis.url.backboneBase + 'js/lib/underscore',
            openhmis.url.inventoryBase + 'js/model/item',
            openhmis.url.inventoryBase + 'js/model/department',
            openhmis.url.backboneBase + 'js/lib/backbone-forms',
            openhmis.url.backboneBase + 'js/lib/labelOver',
            openhmis.url.backboneBase + 'js/view/editors'
    ],
    function(Backbone, _, openhmis) {
        var editors = Backbone.Form.editors;

        editors.ItemAutocomplete = editors.Base.extend({
            tagName: "span",
            className: "editor",
            tmplFile: openhmis.url.cashierBase + 'template/editors.html',
            tmplSelector: '#item-autocomplete-editor',
            departmentCollection: function() {
                var collection = new openhmis.GenericCollection([], { model: openhmis.Department });
                collection.fetch();
                return collection;
            }(),

            initialize: function(options) {
                _.bindAll(this);
                editors.Base.prototype.initialize.call(this, options);
                this.template = this.getTemplate();
                this.cache = {};
                this.departmentCollection.on("reset", this.render);
            },

            events: {
                'change select.department': 'modified',
                'change input.item-name' : 'modified',
                'focus select': 'handleFocus',
                'focus .item-name': 'handleFocus',
                'blur select': 'handleBlur',
                'keypress .item-name': 'onItemNameKeyPress'
            },

            getUuid: function() {
                return this.$('.item-uuid').val();
            },

            getValue: function() {
                return this.value;
            },

            handleFocus: function(event) {
                if (this.hasFocus) return;
                this.trigger("focus", this);
            },

            handleBlur: function(event) {
                if (!this.hasFocus) return;
                var self = this;
                setTimeout(function() {
                    // Check if another input from this editor has come into focus
                    if (self.$('select:focus')[0] || self.$('.item-name:focus')[0] || self.$('label:focus')[0])
                        return;
                    if (self.value) {
                        self.$('.item-name').val(self.value.get("name"));
                        self.$('.department').val(self.value.get("department").id);
                        self.$('label.over-apply').hide();
                    }
                    else
                        self.render();
                    self.trigger("blur", self);
                }, 0);
            },

            onItemNameKeyPress: function(event) {
                if (event.keyCode === 13) {
                    if (this.itemUpdating !== undefined)
                        event.stopPropagation();
                }
            },

            modified: function(event) {
                // TODO: Some logic to handle messing with the form after
                //       successful validation
            },

            doItemSearch: function(request, response) {
                var term = request.term;
                var department_uuid = this.$('.department').val();
                var query = "?q=" + encodeURIComponent(term);
                if (department_uuid) query += "&department_uuid=" + encodeURIComponent(department_uuid);
                this.doSearch(request, response, openhmis.Item, query);
            },

            doSearch: function(request, response, model, query) {
                var term = request.term;
                if (query in this.cache) {
                    response(this.cache[query]);
                    return;
                }
                var resultCollection = new openhmis.GenericCollection([], { model: model });
                var view = this;
                var fetchQuery = query ? query : "?q=" + encodeURIComponent(term);
                resultCollection.fetch({
                    url: resultCollection.url + fetchQuery,
                    success: function(collection, resp) {
                        var data = collection.map(function(model) { return {
                            val: model.id,
                            label: model.get('name'),
                            codes: model.get('codes'),
                            department_uuid: model.get('department').id
                        }});
                        view.cache[query] = data;
                        response(data);
                    }
                });
            },

            selectItem: function(event, ui) {
                this.itemUpdating = true;
                var uuid = ui.item.val;
                var name = ui.item.label;
                var departmentUuid = ui.item.department_uuid;
                this.$('.item-name').val(name);
                this.$('.item-uuid').val(uuid);
                this.$('.department').val(departmentUuid);
                this.value = new openhmis.Item({ uuid: uuid });
                var view = this;
                this.value.fetch({ success: function(model, resp) {
                    view.trigger('change', view);
                    delete view.itemUpdating;
                }});
            },

            departmentKeyDown: function(event) {
                if (event.keyCode === 8) {
                    $(event.target).val('');
                }
            },

            render: function() {
                this.$el.html(this.template({
                    departments: this.departmentCollection,
                    item: this.value
                }));

                this.$('select').keydown(this.departmentKeyDown);
                this.$('label').labelOver('over-apply');

                var self = this;
                this.$('.item-name')
                    .autocomplete({
                        minLength: 2,
                        source: this.doItemSearch,
                        select: this.selectItem
                    })
                    .data("autocomplete")._renderItem = function(ul, item) {
                        // Tricky stuff here to get the autocomplete list to render with our custom data
                        return $("<li></li>").data("item.autocomplete", item)
                            .append("<a>" + openhmis.Item.prototype.getCodesList(item.codes) + ": "
                            + item.label + "</a>").appendTo(ul);
                    };
                return this;
            }
        });

        return editors;
    }
);
