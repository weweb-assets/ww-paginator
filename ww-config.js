export default {
    editor: {
        label: {
            en: 'Paginator',
            fr: 'Paginateur',
        },
        icon: 'dots-horizontal',
        bubble: {
            icon: 'dots-horizontal',
        },
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { context: { page: 0, offset: 0, limit: 0, total: 0 } } },
    ],
    properties: {
        useCustomPagination: {
            label: {
                en: 'Custom pagination',
                fr: 'Pagination personnalisée',
            },
            type: 'OnOff',
            defaultValue: false,
        },
        paginationType: {
            label: {
                en: 'Pagination type',
                fr: 'Type de pagination',
            },
            placeholder: { en: 'Select a type', fr: 'Sélectionnez un type' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'collection', label: 'Collection', icon: 'collection' },
                    { value: 'tableView', label: 'Table View', default: true, icon: '16/table' },
                ],
            },
            defaultValue: 'collection',
            hidden: content => content.useCustomPagination,
        },
        collectionId: {
            hidden: content => {
                if (content.useCustomPagination) return true;
                const type = content.paginationType || 'collection';
                return type !== 'collection';
            },
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
        tableViewId: {
            hidden: content => {
                if (content.useCustomPagination) return true;
                const type = content.paginationType || 'collection';
                return type !== 'tableView';
            },
            placeholder: { en: 'Select a table view', fr: 'Sélectionnez une vue de table' },
            label: {
                en: 'Table View',
                fr: 'Vue de table',
            },
            type: 'TableView',
            defaultValue: null,
        },
        paginatorText: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text' },
        },
        paginatorPrev: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-icon', content: { icon: 'fas fa-angle-left' } },
        },
        paginatorNext: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-icon', content: { icon: 'fas fa-angle-right' } },
        },
        paginatorTotal: {
            hidden: content => !content.useCustomPagination,
            label: { en: 'Total items', fr: 'Total items' },
            type: 'Number',
            defaultValue: 10,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'A number that defines the paginator total items: `10`',
            },
            /* wwEditor:end */
        },
        paginatorLimit: {
            hidden: content => !content.useCustomPagination,
            label: { en: 'Items per page', fr: 'Items per page' },
            type: 'Number',
            defaultValue: 5,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'A number that defines the paginator items per page: `5`',
            },
            /* wwEditor:end */
        },
        paginatorOffset: {
            hidden: content => !content.useCustomPagination,
            label: { en: 'Offset', fr: 'Offset' },
            type: 'Number',
            defaultValue: 0,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'A number that defines the paginator offset: `0`',
            },
            /* wwEditor:end */
        },
    },
};
