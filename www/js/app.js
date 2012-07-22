requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        games: '../games'
    }
});
requirejs(['less', 'app/main']);
