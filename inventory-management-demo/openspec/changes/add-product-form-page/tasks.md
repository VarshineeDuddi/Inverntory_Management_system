## 1. Form component and fields

- [ ] 1.1 Add a Product Form route/component with controlled inputs for name, sku, category, unit_price, quantity, and reorder_level, and verify all six fields render
- [ ] 1.2 Implement create mode starting with empty/default field values, and verify opening the form in create mode shows no pre-filled data
- [ ] 1.3 Implement edit mode that fetches the product via `GET /products/:id` and pre-fills the form, and verify each field matches the fetched product's values

## 2. Client-side required-field validation

- [ ] 2.1 Add a submit-time check that blocks submission and shows an inline message when `name` is blank, without sending a request, and verify no network call occurs and the message appears
- [ ] 2.2 Add the same check for `sku`, and verify no network call occurs and the message appears
- [ ] 2.3 Verify a submission with both fields non-blank passes this client-side check and proceeds to the API call

## 3. Submit, success, and error handling

- [ ] 3.1 Wire create-mode submit to `POST /products` and edit-mode submit to `PUT`/`PATCH /products/:id`, and verify the correct endpoint/method is called in each mode
- [ ] 3.2 Show a success message on a successful create or edit response, and verify it appears for both modes
- [ ] 3.3 Display the backend's `error.message` on a rejected submission (generic case: e.g. an invalid numeric field), and verify the message is shown rather than a silent failure or unhandled exception
- [ ] 3.4 Verify a duplicate-sku rejection specifically displays the backend's field-identifying message (e.g. "sku already exists") to the user

## 4. Verification suite

- [ ] 4.1 Add automated tests (e.g. React Testing Library with a mocked API client) covering every scenario in specs/product-form-page/spec.md: field presence, create-mode empty state, edit-mode pre-fill, blocked blank-name submit, blocked blank-sku submit, successful create, successful edit, generic backend error display, and duplicate-sku error display — verify the test suite exits 0
