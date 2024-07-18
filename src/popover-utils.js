export const CLASS_NOTES_TEXT = "dn-restaurant-notes__text";

export const getRestaurantNotesTemplate = (notes) => `
<div style="display: inline-flex">
    <style>
        #dn-restaurant-notes-popover:popover-open {
            display: flex;
            flex-direction: column;
            padding: 0.5em;
            border: 1px solid #f1f5f9;
            width: 500px;
            max-width: 100%;
            color: #0f172a;
        }

        #dn-restaurant-notes-popover::backdrop {
            background-color: #0f172a66;
        }

        .dn-restaurant-header {
            font-size: 1em;
            margin: 0 0 0.5em;
        }

        .${CLASS_NOTES_TEXT} {
            display: block;
            margin-bottom: 0.5em;
            width: 100%;
            font-size: 0.75em;
        }

        .dn-restaurant-notes__save {
            align-self: flex-end;
            font-size: 0.75em;
        }
    </style>
    <button class="dn-restaurant-notes" popovertarget="dn-restaurant-notes-popover">x</button>
    <dialog id="dn-restaurant-notes-popover" popover>
    <h1 class="dn-restaurant-header">Restaurant Notes Popover</h1>
    <textarea class="${CLASS_NOTES_TEXT}">${notes}</textarea>
    <button class="dn-restaurant-notes__save">Speichern</button>
    </dialog>
</div>
`;
