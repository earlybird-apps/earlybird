export const SystemCategories = {
    Income: {
        name: "Income",
        system_code: "INCOME"
    },
    StartingBalance: {
        name: "Starting Balance",
        system_code: "STARTING_BALANCE"
    },
    Adjustment: {
        name: "Adjustment",
        system_code: "ADJUSTMENT"
    }
}

export enum Dialogs {
    MoveMoney = "move-money",
    RemoveMoney = "remove-money",
    NewTransaction = "new-transaction",
    NewAccount = "new-account",
    NewCategory = "new-category",
    EditTransaction = "edit-transaction",
    DeleteTransaction = "delete-transaction",
    CategoryDetail = "category-detail"
}