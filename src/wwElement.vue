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
                    <wwObject
                        v-bind="content.paginatorText"
                        :ww-props="{ text: nav.label }"
                        :states="nav.states"
                    ></wwObject>
                </li>
            </template>
            <li :class="{ 'hide-icon': !isEditing && currentPage === nbPage - 1 }" @click="next">
                <wwObject v-if="content.paginatorNext" v-bind="content.paginatorNext"></wwObject>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
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
            if (!this.content.collectionId) return null;
            return wwLib.wwCollection.getPaginationOptions(this.content.collectionId);
        },
        nbPage() {
            if (!this.paginationOptions) return 10;
            return Math.ceil(this.paginationOptions.total / this.paginationOptions.limit);
        },
        currentPage() {
            if (!this.paginationOptions) return 1;
            return Math.floor(this.paginationOptions.offset / this.paginationOptions.limit);
        },
        navigation() {
            const lastPage = this.nbPage - 1;
            const prev = this.currentPage - 1;
            const next = this.currentPage + 1;
            let index = 0;
            let navigation = [];
            navigation.push({ label: '1', index: 0 });

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
                navigation.push({ label: `${this.currentPage + 1}`, index: this.currentPage });
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
                navigation.push({ label: `${lastPage + 1}`, index: lastPage });
            }

            return navigation;
        },
    },
    methods: {
        goTo(index) {
            if (!this.paginationOptions) return;
            if (index !== -1 && index !== this.currentPage) {
                wwLib.wwCollection.setOffset(this.content.collectionId, index * this.paginationOptions.limit);
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
    }
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
