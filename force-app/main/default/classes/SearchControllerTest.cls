/**
 * @description       : Test class for SearchController apex class
 * @author            : ashvin.j@infogen-labs.com
 * @group             : 
 * @last modified on  : 10-28-2021
 
**/
@isTest
public class SearchControllerTest{


    /**
    * @description 
    * @author ashvin.j@infogen-labs.com | 10-28-2021 
    * @return testMethod 
    **/
    public static testMethod void searchTest(){
    
        Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Id [] fixedSearchResults= new Id[1];
        fixedSearchResults[0] = acc.Id;
        Test.setFixedSearchResults(fixedSearchResults);
        list<ObjectMapper> objMapperList = new list<ObjectMapper>();
        
        objMapperList.add(new ObjectMapper(
                           'Account',
                           'Account',
                           'Name',
                           'Name', 
                           'standard:account'));
                           
       objMapperList.add(new ObjectMapper(
                           'Contact',
                           'Contact',
                           'Name',
                           'Name', 
                           'standard:contact')); 
        
        String objectConfig = JSON.serialize(objMapperList);
        
        Test.StartTest();
        SearchController.search(objectConfig ,'test');
        Test.StopTest();
    
    }
    
    public class ObjectMapper{
        public string label;
        public string APIName;
        public string fields;
        public string displayFields;
        public string iconName;
        
        Public ObjectMapper(String labl, String apiNm, String flds, String displFlds, String icnName){
            label = labl;
            APIName = apiNm;
            fields = flds;
            displayFields = displFlds;
            iconName = icnName; 
        }
    }

}