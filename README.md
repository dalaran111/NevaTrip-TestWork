# NevaTrip-TestWork

1.ВЕРСТКА
1.1 Верстка блока
Нужно сверстать страницу по макету по принципу mobile-first.

Примечания:
Если времен больше чем на 1 строчку, то в конце строчки должна появиться кнопка "ещё..." при нажатии на которую будут раскрываться скрытые времена.
Под ценой может не быть надписи "1200₽ на причале" в таком случае цена должна быть выровнена посередине относительно копки "подробнее"

1.2 Таблица на странице
В текст статьи на странице с адаптивной версткой менеджеры добавили таблицу. На десктопе таблицы выглядят хорошо, но на мобиле - появляется горизонтальный скролл, верстка едет. Что делать?

Решение: Для .blog добавляем box-sizing: border-box; 
                   добавляем overflow: hidden;
Также можно добавить table { font-size: 14px } для более аккуратного отображения на маленьких устройствах

![Screenshot](https://github.com/dalaran111/NevaTrip-TestWork/blob/master/Task1/src/img/Table%20scroll/%D0%A3%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D1%81%D0%BA%D1%80%D0%BE%D0%BB%D0%BB.png?raw=true)

2. БД и JS часть.

2.1 Билеты на событие

Решение: Исходную таблицу необходимо было декомпозировать, чтобы избавиться от избыточности информации.
Информация по таблицам:
DEFAULT_ORDER:
-id - уникальный идентификатор заказа
-ticket_type_id - уникальный идентификатор типа билета (льготный или групповой). По нему можно понять, какого типа билет, льготный или групповой, либо же обычный(тогда цена для посетителей определяется базовой ценой, прописаной в описании самого события в таблице Events.
-event_id - уникальный идентификатор события. По нему можно узнать всю информацию о событии из таблицы Events.
-ticket_quantity_adult - количество взрослых билетов в заказе
-ticket_quantity_kid - количество детских билетов в заказе
-user_id - уникальный идентификатор посетителя
-equal_price - общая стоимость билетов в заказе
-created - дата заказа

PRICES:
ticket_type_id - ticket_type_id - уникальный идентификатор типа билета (льготный или групповой). По нему можно понять, какого типа билет, льготный или групповой, либо же обычный(тогда цена для посетителей определяется базовой ценой, прописаной в описании самого события в таблице Events.
ticket_group_price_id - цена для группового билета
ticket_group_adult_preferential_price - цена взрослго льготного билета
ticket_kid_preferential_price - цена десткого льготного билета

EVENTS: 
event_id - event_id - уникальный идентификатор события. По нему можно узнать всю информацию о событии
event_name - название события
event_price_adult - стандартная цена события для взрослого
event_price_kid - стандартная цена события для ребенка
event_date - дата проведения события
event_descr - описание события

USERS:
user_id - уникальный идентификатор пользователя
barcode - баркод, прикрепляемый к пользователю при покупке билета. Каждый раз, когда один и тот же пользователь покупает новый билет, его баркод будет обновляться, 
предварительно использовавшись для записи в заказе. Таким образом для каждого покупателя в одном заказе будет уникальный баркод

