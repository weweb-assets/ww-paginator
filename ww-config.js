export default {
    editor: {
        label: {
            en: 'Paginator',
            fr: 'Paginateur',
        },
    },
    properties: {
        collectionId: {
            label: {
                en: 'Collection',
                fr: 'Collection',
            },
            type: 'Collection',
            options: {
                paginated: true,
            },
            defaultValue: null,
        },
        paginatorText: {
            hidden: true,
            defaultValue: {isWwObject: true, type: 'ww-text' },
        },
        paginatorPrev: {
            hidden: true,
            defaultValue: {isWwObject: true, type:'ww-icon', content: { icon: 'fas fa-angle-left' }  },
        },
        paginatorNext: {
            hidden: true,
            defaultValue:{isWwObject: true, type:'ww-icon', content: { icon: 'fas fa-angle-right' }  },
        },
    },
};
