# Фото товаров

Положите сюда файлы с именами из `src/data/products.json` (поле `image`):
sylvia.jpg, noelle.jpg, aurora.jpg, mira.jpg, lauren.jpg, bernadette.jpg, faye.jpg, camille.jpg

Формат: вертикальный 3:4 (например 1200×1600), JPG/WebP до ~300 КБ.
Пока файла нет, сайт показывает SVG-заглушку.

## Шаблон промпта (Midjourney / Flux / Ideogram)
Studio portrait of a woman wearing a {length} {color} wig, natural hairline, realistic hair texture,
soft diffused light, neutral backdrop, shoulders-up, 85mm lens, editorial beauty photography, 3:4
Держите один стиль света/фона для всех товаров и одну и ту же модель/ракурс там, где это возможно.
Добавьте --no wig cap lines, plastic shine (или negative prompt: shiny, plastic, visible wig cap).

## Передняя и задняя стороны
У каждого товара два файла: `name.jpg` (спереди — обложка) и `name-back.jpg` (сзади).
Новые товары: adrian, damian (мужские), lily, max (детские).
Одинаковый ракурс, свет и фон для front/back — тогда лупа и перелистывание выглядят цельно.
Если back-файла нет, в галерее показывается SVG-заглушка.
Детские фото: используйте реальных моделей с согласия родителей или иллюстративные/AI-изображения без реальных людей.
