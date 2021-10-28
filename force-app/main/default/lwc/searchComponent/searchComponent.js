import { LightningElement, api } from 'lwc';
import search from '@salesforce/apex/SearchController.search';
const DELAY = 300;

export default class SearchComponent extends LightningElement {
    @api objectconfig;
    @api currentRecordId;
    @api placeholder;
    @api labelName;
    error;
    searchTerm;
    delayTimeout;
    searchRecords ;
    selectedRecord;
    boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    inputClass = '';
    
    // This function is called when user starts typing into input search
    handleInputChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
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
            }
        }, DELAY);
    }

    //This function is called when user selects a record from dropdown
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

    //This function is called when a user clicks inside input search
    handleClick(){
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    //This function is called when a user clicks outside the input search bar
    onBlur(){
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    //This function is called when user removes selected record from dropdown
   @api handleClose(){
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
}