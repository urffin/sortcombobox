(function ($) {
    if ($ == null) return;

    $.fn.sortcombobox = function (options) {
        var settings = $.extend({
            // These are the defaults.
            SearchedText: '--Searched--',
            OthersText: '<hr >'
        }, options);

        this.filter('select').each(function (index) {
            function CreateOption(val, text, ignoreEvent) {
                var option = $('<div data-value="' + val + '" data-text="' + text + '">' + text + '</div>')
                                .addClass('SortComboboxOption');
                if (!ignoreEvent) {
                    option.mouseenter(function () { $(this).addClass('SortComboboxSelectedOption'); })
                          .mouseleave(function () { $(this).removeClass('SortComboboxSelectedOption'); })
                          .click(function (e) {
                              input.val($(this).data('text')).trigger('input');
                              select.val($(this).data('value')).change();
                              optionsWrapper.hide();
                          });
                } else {
                    option.append('<hr>');
                }
                return option;
            }

            var select = $(this),
                inside = false,
                oldValue = '',
                wrapper = $('<div></div>').addClass('SortComboboxWrapper'),
                optionsObj = [],
                input = $('<input>').attr('type', 'text').focus(function () {
                    optionsWrapper.show();
                    input.val('');
                }).blur(function () {
                    if (!inside) {
                        optionsWrapper.hide();
                        var text = input.val().toUpperCase(),
                            selectedOptions = optionsObj.filter(function (o) { return o.text == text });

                        if (selectedOptions.length === 1 && selectedOptions[0].value !== select.val()) {
                            select.val(selectedOptions[0].value).change();
                        } else {
                            input.val(select.children(':selected').text()).trigger('input');
                        }
                    }
                }),
                optionsWrapper = $('<div></div>').addClass('SortComboboxOptionsWrapper');

            select.find('option').each(function (index, option) {
                optionsObj.push({ text: this.text, value: this.value });
                optionsWrapper.append(CreateOption(this.value, this.text));
            });
            wrapper = select.css({ 'display': 'none' }).wrap(wrapper).parent().mouseenter(function () { inside = true; }).mouseleave(function () { inside = false; });
            wrapper.append(input).append(optionsWrapper);

            select.change(function (event, isOutside) {
                if (isOutside !== undefined) {
                    input.val(select.children(':selected').text()).trigger('input');
                }
            }).on('disable', function () {
                input.attr('disabled', 'disabled');
            }).on('enable', function () {
                input.removeAttr('disabled');
            });

            input.keydown(function (event) {
                switch (event.keyCode) {
                    case 9: inside = false; break;
                    case 13: inside = false; input.blur(); break;
                    case 104: //up
                    case 38:
                        break;
                    case 98: // down
                    case 40:
                        break;
                }
            }).on('input propertychange', function (event) {

                var text = this.value.toUpperCase(),
                        search = [],
                        other = [];

                if (oldValue === text) return;
                oldValue = text;

                for (var i in optionsObj) {
                    var o = optionsObj[i];
                    if (o.text.indexOf(text) > -1) {
                        search.push(CreateOption(o.value, o.text));
                    } else {
                        other.push(CreateOption(o.value, o.text));
                    }
                }

                //if (search.length > 0) search.splice(0, 0, CreateOption(settings.SearchedText, settings.SearchedText, true));
                if (other.length > 0) other.splice(0, 0, CreateOption("", "", true));

                optionsWrapper.children().remove();
                optionsWrapper.append(search).append(other);
            })
            .val(select.children(':selected').text()).trigger('input');
        });

        return this;
    }
})(jQuery);