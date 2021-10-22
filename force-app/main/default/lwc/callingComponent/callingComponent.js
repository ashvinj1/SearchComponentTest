import { LightningElement } from 'lwc';

export default class CallingComponent extends LightningElement {

    AccFields = ["Name","AccountNumber"];
    AccDisplayFields = 'Name,AccountNumber';
    ObjectConfig = [
                    {'label':  'Contact', 'APIName': 'Contact', 'fields':'Name,FirstName,LastName,Email,Phone','displayFields':'Name,Phone,Email', 'iconName': 'standard:contact',  'FilterCondition' : 'AccountId != NULL'}];
    handleAccountChange(event){
        console.log('***In handleAccountChange**');
    }

    handlesearchInputChange(event){
        console.log('***In handlesearchInputChange**');
    }
}