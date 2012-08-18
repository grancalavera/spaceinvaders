requirejs.config({
    urlArgs: 'f=' + (new Date().getTime()),
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        games: '../games'
    }
});
requirejs(['less', 'app/main']);
