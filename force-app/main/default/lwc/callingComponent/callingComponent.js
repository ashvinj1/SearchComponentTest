import { LightningElement } from 'lwc';

export default class CallingComponent extends LightningElement {

    //better option with custom metadata type
    ObjectConfig = [ //Array of objects
        {
            'label':  'Contact', 
            'APIName': 'Contact', 
            'fields':'Name,FirstName,LastName,Email,Phone',
            'displayFields':'Name,Phone,Email', 
            'iconName': 'standard:contact',
            'FilterCondition' : 'AccountId != NULL'
        },
        {
            'label':  'Account', 
            'APIName': 'Account', 
            'fields':'Name',
            'displayFields':'Name,AnnualRevenue,AccountNumber', 
            'iconName': 'standard:account',  
            'FilterCondition' : 'AccountNumber != NULL'
        }
    ];
    handleAccountChange(event){
        console.log('***In handleAccountChange**');
    }

    handlesearchInputChange(event){
        console.log('***In handlesearchInputChange**');
    }
}