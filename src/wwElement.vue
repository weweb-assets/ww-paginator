<template>
    <nav role="navigation">
        <ul>
            <li :class="{ 'hide-icon': !isEditing && currentPage === 0 }" @click="prev">
                <wwObject v-if="content.paginatorPrev" v-bind="content.paginatorPrev"></wwObject>
            </li>
            <template v-if="content.paginatorText">
                <li
                    v-for="(nav, index) in navigation"
                    :key="index"
                    :aria-current="nav.index === currentPage"
                    @click="goTo(nav.index)"
                >
                    <wwLayoutItemContext is-repeat :index="index">
                        <wwElement
                            v-bind="content.paginatorText"
                            :ww-props="{ text: nav.label }"
                            :states="nav.states"
                        ></wwElement>
                    </wwLayoutItemContext> 
                </li>
            </template>
            <li :class="{ 'hide-icon': !isEditing && currentPage === nbPage - 1 }" @click="next">
                <wwObject v-if="content.paginatorNext" v-bind="content.paginatorNext"></wwObject>
            </li>
        </ul>
    </nav>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event'],
    setup(props) {
        const { value: currentPage, setValue: setCurrentPage } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'page',
            type: 'number',
            readonly: true,
            defaultValue: 0
        });

        const { setValue: setInternalOffset } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'offset',
            type: 'number',
            readonly: true,
            defaultValue: 0,
        });

        const { setValue: setInternalLimit } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'limit',
            type: 'number',
            readonly: true,
            defaultValue: 0,
        });

        const { setValue: setInternalTotal } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'total',
            type: 'number',
            readonly: true,
            defaultValue: 0,
        });

        return { currentPage, setCurrentPage, setInternalOffset, setInternalLimit, setInternalTotal };
    },
    watch: {
        'paginationOptions.limit'(newVal, oldVal){
            if(newVal != oldVal && this.updateInternalValues)
                this.updateInternalValues();
        },
        'paginationOptions.total'(newVal, oldVal){
            if(newVal != oldVal && this.updateInternalValues)
                this.updateInternalValues();
        },
        'paginationOptions.offset'(newVal, oldVal){
            if(newVal != oldVal && this.updateInternalValues)
                this.updateInternalValues();
        },
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        paginationOptions() {
            if (this.content.useCustomPagination) {
                console.log(this.content.paginatorTotal)
                return {
                    limit: this.content.paginatorLimit,
                    offset: this.content.paginatorOffset,
                    total: this.content.paginatorTotal,
                };
            }

            if (!this.content.collectionId) return null;
            return wwLib.wwCollection.getPaginationOptions(this.content.collectionId);
        },
        nbPage() {
            if (!this.paginationOptions) return 10;
            const nbPage = Math.ceil(this.paginationOptions.total / this.paginationOptions.limit);
            return isNaN(nbPage) ? 1 : nbPage;
        },
        updateInternalValues(){
            let currentPage;
            if (!this.paginationOptions) currentPage = 1;
            else {
                const _currentPage = Math.floor(this.paginationOptions.offset / this.paginationOptions.limit);
                currentPage = isNaN(_currentPage) ? 0 : _currentPage;
            }

            this.setCurrentPage(currentPage);
            this.setInternalOffset(this.paginationOptions.offset);
            this.setInternalLimit(this.paginationOptions.limit);
            this.setInternalTotal(this.paginationOptions.total);
        },
        navigation() {
            const lastPage = this.nbPage - 1;
            const prev = this.currentPage - 1;
            const next = this.currentPage + 1;
            let index = 0;
            let navigation = [];
            navigation.push({ label: '1', index: 0, states: 0 === this.currentPage ? ['active'] : [] });

            // Prev page
            if (prev > index) {
                // Separator
                if (prev > index + 1) {
                    navigation.push({ label: '...', index: -1 });
                }
                navigation.push({ label: `${prev + 1}`, index: prev });
                index = prev;
            }

            // Current page
            if (this.currentPage !== 0 && this.currentPage !== lastPage) {
                navigation.push({ label: `${this.currentPage + 1}`, index: this.currentPage, states: ['active'] });
                index = this.currentPage;
            }

            // NextPage
            if (next < lastPage && next > index) {
                navigation.push({ label: `${next + 1}`, index: next });
                index = next;
                // Separator
                if (next < lastPage - 1) {
                    navigation.push({ label: '...', index: -1 });
                }
            }

            // Last page
            if (lastPage > index) {
                navigation.push({
                    label: `${lastPage + 1}`,
                    index: lastPage,
                    states: lastPage === this.currentPage ? ['active'] : [],
                });
            }
            return navigation;
        },
    },
    methods: {
        goTo(index) {
            if (!this.paginationOptions) return;
            if (index !== -1 && index !== this.currentPage) {
                if (!this.content.useCustomPagination) {
                    wwLib.wwCollection.setOffset(this.content.collectionId, index * this.paginationOptions.limit);
                }

                this.$emit('trigger-event', {
                    name: 'change',
                    event: { context: { offset: index * this.paginationOptions.limit, page: index + 1 } },
                });
            }
        },
        prev() {
            if (this.currentPage > 0) {
                this.goTo(this.currentPage - 1);
            }
        },
        next() {
            if (this.currentPage < this.nbPage - 1) {
                this.goTo(this.currentPage + 1);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
ul {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
    li {
        margin: 0;
        padding: 0;
        user-select: none;
        cursor: pointer;
        margin: 0;
    }
}
.hide-icon {
    opacity: 0;
    pointer-events: none;
}
</style>
