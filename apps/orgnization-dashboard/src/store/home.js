import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useHomeStore = defineStore({
    id: 'home',
    state: () => ({
        balanceSheet: [],
        balanceSheetPerAccountType: [],
        accountTypeOrderBy: {
            'Asset': 1,
            'Income': 2,
            'Liability': 3,
            'Expense': 4,
            'Equity': 5,
            'Net Profit(Loss)': 6

        }
    }),
    actions: {
        async fetchTrialBalance() {
            this.balanceSheet=[]
            const { data } = await api.get('/Finance/Ledgers/GetTrialBalance');
            this.accountGroups = data?.data;
            console.log('tet')
            if(!this.accountGroups)
            {
                this.accountGroups=[
                    {
                        "accountType": "Asset",
                        "accountGroup": "Cash",
                        "debit": 0,
                        "credit": 0,
                        "balance": 0
                    },
                    {
                        "accountType": "Asset",
                        "accountGroup": "Inventory",
                        "debit": 0,
                        "credit": 0,
                        "balance": 0
                    },
                    {
                        "accountType": "Liability",
                        "accountGroup": "Account Payables",
                        "debit": 0,
                        "credit": 0,
                        "balance": 0
                    }
                ]
            }
            this.balanceSheetPerAccountType=[];
            await this.CalcProfileLoss();
        },
        async CalcProfileLoss() {

            if (this.accountGroups.length > 0) {

                let getFinalResult = this.accountGroups.reduce((finalResult, item) => {
                    finalResult[item.accountType] = finalResult[item.accountType] || { total: 0.0, accountType: item.accountType, accountGroupList: [], orderBy: 0 };
                    finalResult[item.accountType].total += item.balance;
                    finalResult[item.accountType].accountGroupList.push(item);
                    return finalResult;
                }, {});

                let totalIncome = getFinalResult['Income'] == undefined ? 0.0 : getFinalResult['Income'].total;
                let totalExpenses = getFinalResult['Expense'] == undefined ? 0.0 : getFinalResult['Expense'].total;
                getFinalResult['Net Profit(Loss)'] = { total: totalIncome - totalExpenses, accountType: 'Net Profit(Loss)', accountGroupList: [], orderBy: 0 };
                for (let keys in this.accountTypeOrderBy) {
                    if (getFinalResult[keys]) {
                        getFinalResult[keys]['orderBy'] = this.accountTypeOrderBy[keys];
                        this.balanceSheetPerAccountType.push(getFinalResult[keys]);
                    } else {
                        this.balanceSheetPerAccountType.push({ total: 0.0, accountType: keys, accountGroupList: [], orderBy: this.accountTypeOrderBy[keys] })
                    }

                }
                this.balanceSheetPerAccountType = this.balanceSheetPerAccountType.sort((a, b) => a['orderBy'] - b['orderBy']);
            }

        }
    },
});
