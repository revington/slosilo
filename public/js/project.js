(function (MODELS) {
    MODELS.PROJECT = {
        dayTicks: 24 * 60 * 60 * 1000,
        reverseSearchForValue: function (items) {
            return function (now) {
                var i = items.length,
                    c;
                while (i--) {
                    c = items[i];
                    if (now >= c.from() && now <= c.to()) {
                        return c.value();
                    }
                }
                return 0;
            };
        },
        groupByMonth: function (items) {
            if (!items || !items.length) {
                return;
            }
            var f = function (item) {
                    return item.date.getMonth() + 1;
                }, c = f(items[0]),
                i, j, ret = [], epoch;
								epoch = items[0].date;
            for (j = 0, i = 0; i < items.length; i++) {
              if (f(items[i]) !== c) {
                    ret.push({
											time: epoch,
                        days: items.slice(j, i)
                    });
								epoch = items[i].date;
                    c = f(items[i]);
                    j = i;
                }
            }
            ret.push({
							time: epoch,
                days: items.slice(j, i)
            });
            return ret;
        },
        calendar: function () {
            var from = this.showFrom(),
                to = this.showTo(),
                items = this.changes(),
                findFirst = MODELS.PROJECT.reverseSearchForValue(items),
                ret = [],
                dayTicks = MODELS.PROJECT.dayTicks;
            for (; from <= to; from += dayTicks) {
                ret.push({
                    value: findFirst(from),
                    date: new Date(from)
                });
            }
            return MODELS.PROJECT.groupByMonth(ret);
        },
        extendProject: function (that) {
            var cal = this.calendar;
            that.showFrom = ko.observable(new Date().getTime());
            that.showTo = ko.observable(new Date().getTime() + (5 * 30 * 24 * 60 * 60 * 1000));
            that.calendar = ko.computed(function () {
                return cal.call(that);
            });
            console.log(new Date(that.showFrom()));
            console.log(new Date(that.showTo()));
        }
    };
})(window.MODELS);
