export function photographerFactory(data) {
    const { name, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.setAttribute("src", picture)
        const h2 = document.createElement('h2');
        h2.textContent = name;
        const location = document.createElement('span');
        location.textContent = city + ', ' + country;
        location.classList.add('photographer_location');
        const slogan = document.createElement('span');
        slogan.textContent = tagline;
        slogan.classList.add("photographer_slogan");
        const pricePerDay = document.createElement('span');
        pricePerDay.textContent = price + "€/jour";
        pricePerDay.classList.add("photographer_price");
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(location);
        article.appendChild(slogan);
        article.appendChild(pricePerDay);

        return (article);
    }
    return { name, picture, getUserCardDOM }
}
