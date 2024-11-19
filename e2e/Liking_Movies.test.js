const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
    I.amOnPage('/#/like');
});


Scenario('show empty liked movies', ({ I }) => {
    I.seeElement('#query');

    I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});

Scenario('liking one movie', async ({ I }) => {
    I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

    I.amOnPage('/');

    I.seeElement('.movie__title a');
    const firstMovie = locate('.movie__title a').first();
    const firstMovieTitle = await I.grabTextFrom(firstMovie);
    I.click(firstMovie);

    I.seeElement('#likeButton');
    I.click('#likeButton');

    I.amOnPage('/#/like');
    I.seeElement('.movie-item');
    const likedMovieTitle = await I.grabTextFrom('.movie__title');

    assert.strictEqual(firstMovieTitle, likedMovieTitle);
});

Scenario('searching movies', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
  I.amOnPage('/');
  I.seeElement('.movie__title a');

  const titles = [];
  for(let i = 1;i <= 3;i++){
    I.click(locate('.movie__title a').at(i));

    I.seeElement('#likeButton');
    I.click('#likeButton');

    titles.push(await I.grabTextFrom('.movie__title'));

    I.amOnPage('/');
  }
  I.amOnPage('/#/like');
  I.seeElement('#query');
 
  const visibleLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(titles.length, visibleLikedMovies);

  const searchQuery = titles[1].substring(1, 3);
  I.fillField('#query', searchQuery);
  I.pressKey('Enter');

  // mendapatkan daftar film yang sesuai dengan searchQuery
  const matchingMovies = titles.filter((title) => title.indexOf(searchQuery) !== -1);
  const visibleSearchedLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(matchingMovies.length, visibleSearchedLikedMovies);

  for(let i = 0; i < matchingMovies.length; i++){
    const visibleTitle = await I.grabTextFrom(locate('.movie__title').at(1));

    assert.strictEqual(matchingMovies[i], visibleTitle);
  }
});
