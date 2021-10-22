import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import search from '@salesforce/apex/SearchController.search';
const DELAY = 300;
export default class SearchComponent extends LightningElement {

    @api valueId;
    @api valueName;
    @api objectconfig = [{'label':  'Account', 'APIName': 'Account', 'fields':'Name,AccountNumber', 'displayFields':'Name,AccountNumber', 'iconName': 'standard:account'},
                         {'label':  'Contact', 'APIName': 'Contact', 'fields':'Name,FirstName,LastName,Email,Phone','displayFields':'Name,Phone,Email', 'iconName': 'standard:contact', 
                          'FilterCondition' : 'RecordType.DeveloperName = \'Investor\'', }];
    @api objName = 'Account';
    @api iconName = 'standard:account';
    @api labelNameList ;
    @api labelName;
    @api readOnly = false;
    @api currentRecordId;
    @api placeholder = 'Search';
    @api createRecord;
    @api fields = ['Name'];
    @api displayFields = 'Name, Rating, AccountNumber';

    @track error;

    searchTerm;
    delayTimeout;

    searchRecords ;
    selectedRecord;
    objectLabel;
    isLoading = false;

    field;
    field1;
    field2;
    fieldList =[] ;
    ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';
    boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    inputClass = '';
    connectedCallback(){
       console.log('objectConfig'+this.objectConfig);
    }

    handleInputChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        //this.isLoading = true;
        
        this.delayTimeout = setTimeout(() => {
            if(searchKey.length >= 2){
                var inputObjConfig = JSON.stringify(this.objectconfig);
                search({ 
                    objectsConfig : inputObjConfig,
                    searchTerm    : searchKey 
                })
                .then(result => {
                    console.log(result);
                    let stringResult = JSON.stringify(result);
                    let allResult    = JSON.parse(result);
                    console.log(allResult);
                    let recordArray=[];
                    const keys = Object.keys(allResult);
                    keys.forEach((key, index) => {
                        for(var i=0;i<allResult[key].length;i++){
                            
                            recordArray.push(allResult[key][i]);
                        }
                    });
                    this.searchRecords = recordArray;
                    console.log( this.searchRecords);
                    const selectedEvent = new CustomEvent('inputchange', {
                        bubbles    : true,
                        composed   : true,
                        cancelable : true,
                        detail: { 
                            records : this.searchRecords
                        }
                    });
                    this.dispatchEvent(selectedEvent);
                })
                
                .catch(error => {
                    console.log('Error:', error);
                })
                .finally( ()=>{
                    //this.isLoading = false;
                });
                
            }
        }, DELAY);
    }

    handleSelect(event){
        console.log('In handleSelect');
        let recordId = event.currentTarget.dataset.recordId;
        
        let selectRecord = this.searchRecords.find((item) => {
            return item.Id === recordId;
        });
        this.selectedRecord = selectRecord;
        console.log(this.selectedRecord );
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                data : {
                    record          : selectRecord,
                    recordId        : recordId,
                    currentRecordId : this.currentRecordId
                }
            }
        });
        this.dispatchEvent(selectedEvent);
        
    }

    handleClick() {
        
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    handleRemovePill() {
        this.selectedRecord = undefined;
        this.dispatchEvent(new CustomEvent('lookupselected', {detail:  {
            "selectedId": ""
        } }));
    }


    @api handleClose(){
        console.log('***In handleClose***');
        this.selectedRecord = undefined;
        this.searchRecords  = undefined;
        let recordId = undefined;
        let record = undefined;
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                record ,
                recordId,
                currentRecordId : this.currentRecordId
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    titleCase(string) {
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }
}