migrate((app) => {
    const work = new Collection({
        type: 'base',
        name: 'work',
        listRule: 'hidden = false',
        viewRule: 'hidden = false',
        fields: [
            { name: 'source_id', type: 'number' },
            { name: 'created_at', type: 'date' },
            { name: 'name', type: 'text' },
            { name: 'featured', type: 'bool' },
            { name: 'description', type: 'text' },
            { name: 'description_ja', type: 'text' },
            { name: 'url', type: 'text' },
            { name: 'blurb', type: 'text' },
            { name: 'blurb_ja', type: 'text' },
            { name: 'imageFull', type: 'text' },
            { name: 'imageFull2', type: 'text' },
            { name: 'image_thumb', type: 'text' },
            { name: 'images_sm', type: 'text' },
            { name: 'image_md', type: 'text' },
            { name: 'type', type: 'text' },
            { name: 'name_ja', type: 'text' },
            { name: 'type_ja', type: 'text' },
            { name: 'hidden', type: 'bool', default: false },
        ],
    });

    const posts = new Collection({
        type: 'base',
        name: 'posts',
        listRule: 'hidden = false',
        viewRule: 'hidden = false',
        fields: [
            { name: 'source_id', type: 'number' },
            { name: 'created_at', type: 'date' },
            { name: 'name', type: 'text' },
            { name: 'featured', type: 'bool' },
            { name: 'description', type: 'text' },
            { name: 'url', type: 'text' },
            { name: 'blurb', type: 'text' },
            { name: 'blurb_ja', type: 'text' },
            { name: 'imageFull', type: 'text' },
            { name: 'image_thumb', type: 'text' },
            { name: 'images_sm', type: 'text' },
            { name: 'image_md', type: 'text' },
            { name: 'image_lg', type: 'text' },
            { name: 'type', type: 'text' },
            { name: 'name_ja', type: 'text' },
            { name: 'type_ja', type: 'text' },
            { name: 'hidden', type: 'bool', default: false },
        ],
    });

    app.save(work);
    app.save(posts);

    const settings = app.settings();
    settings.meta.appName = 'Jamie Taylor Portfolio API';
    settings.meta.appURL = 'https://jamietaylor.me';
    settings.meta.hideControls = true;
    app.save(settings);
}, (app) => {
    app.delete(app.findCollectionByNameOrId('posts'));
    app.delete(app.findCollectionByNameOrId('work'));
});
