/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 09-09-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class SearchController {

    /*@AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String returningQuery = '';
        returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        return searchRecords.get(0);
    }*/
    
    @AuraEnabled
    public static string search(string  objectsConfig, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String searchKeywordforLIKE = '%'+searchTerm+'%';
        String returningQuery = '';
        list<object> objectfieldMap = (list<object>) JSON.deserializeUntyped(objectsConfig);
        map<String, set<String>> mapofobjFields = new map<String,set<String>>();
        map<String, String> mapofobjDisplayFields = new map<String,String>();
        map<String, String> mapofObjectIconURL = new map<String,String>();
        map<String, String> mapofObjectIconName = new map<String,String>();
        map<String, String> mapofObjectAPILabel = new map<String, String>();

        //process each array and form a map of unique object name to related values such as icon name, displayfields
        for(object obj : objectfieldMap){
            Map<String,Object> data = (Map<String,Object>)obj;
            mapofobjDisplayFields.put(string.valueof(data.get('APIName')),string.valueof(data.get('displayFields')));
            String combinedFields = data.get('fields') + ',' + data.get('displayFields');
            list<String> fieldlst = combinedFields.split(',');
            String filterCondition = String.valueof(data.get('FilterCondition'));
            //Get the icon name for object
            if(data.get('iconName') != null && data.get('iconName') != ''){
                String iconUrl = '/apexpages/slds/latest/assets/icons/'+String.valueof(data.get('iconName')).split(':')[0]+'-sprite/svg/symbols.svg#'+String.valueof(data.get('iconName')).split(':')[1];
                mapofObjectIconURL.put(string.valueof(data.get('APIName')),iconUrl);
                mapofObjectIconName.put(string.valueof(data.get('APIName')),String.valueof(data.get('iconName')));
            }

            //form a query
            set<string> uniqueFields = new set<String>(fieldlst);
            
            if(returningQuery == ''){
                if(filterCondition != '' && filterCondition != NULL){
                    returningQuery = data.get('APIName')+ ' ( Id, '+String.join((Iterable<String>)uniqueFields, ', ')+' WHERE '+filterCondition+')';
                }else{
                    returningQuery = data.get('APIName')+ ' ( Id, '+String.join((Iterable<String>)uniqueFields, ', ')+')';
                }
            }else{
                if(filterCondition != '' && filterCondition != NULL){
                    returningQuery += ','+ data.get('APIName')+ ' ( Id, '+String.join((Iterable<String>)uniqueFields, ', ')+' WHERE '+filterCondition+')';
                }else{
                    returningQuery += ','+ data.get('APIName')+ ' ( Id, '+String.join((Iterable<String>)uniqueFields, ', ')+')';
                }
            }
            system.debug('returningQuery'+returningQuery);
            mapofobjFields.put(string.valueof(data.get('APIName')),uniqueFields);
            mapofObjectAPILabel.put(string.valueof(data.get('APIName')),string.valueof(data.get('label')));
        }
        
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        JSONGenerator jsonGen = JSON.createGenerator(true);
        jsonGen.writeStartObject();
        for(List<sObject> records : searchRecords){
            jsonGen.writeFieldName(string.valueof(records.getSObjectType()));
            jsonGen.writeStartArray();
            String[] displayFieldLst = mapofobjDisplayFields.get(string.valueof(records.getSObjectType())).split(',');
            for(sobject record : records){
                jsonGen.writeStartObject();
                jsonGen.writeFieldName('displayFields');
                jsonGen.writeObject(displayFieldLst);
                jsonGen.writeStringField('Id',(string)record.get('Id'));
                jsonGen.writeStringField('Label',mapofObjectAPILabel.get(string.valueof(records.getSObjectType())));
                jsonGen.writeStringField('ICONURL',mapofObjectIconURL.get(string.valueof(records.getSObjectType())));
                jsonGen.writeStringField('ICONName',mapofObjectIconName.get(string.valueof(records.getSObjectType())));
                for(String fld : mapofobjFields.get(string.valueof(record.getSObjectType()))){
                    system.debug(fld);
                    system.debug((string)record.get(fld));
                    if((string)record.get(fld) != null){
                        jsonGen.writeStringField(fld, (string)record.get(fld));
                    }else{
                        jsonGen.writeStringField(fld,'');
                    }
                    for(Integer i=0;i<displayFieldLst.size();i++){
                        if(fld==displayFieldLst[i]){
                            string fieldValue = (string)record.get(fld)==NULL ? '' : (string)record.get(fld);
                            jsonGen.writeStringField('FIELD'+i,fieldValue);
                        }
                    }
                }
                jsonGen.writeStringField('Type',string.valueof(record.getSObjectType()));
                jsonGen.writeEndObject();
            }
            jsonGen.writeEndArray();
        }
        jsonGen.writeEndObject();
        String jsonData = jsonGen.getAsString();
        return jsonData;
    }
}