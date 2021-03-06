/**
 * Support module for automated UI tests for ALMighty
 * 
 * Ref: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
 * 
 * @author ldimaggi
 */

module.exports = {

/**
 * Set the browser window size
 * 
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667 (note: tests on chrome+firefox fail unless width >= 400)
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 */
  setBrowserMode: function(browserModeStr) {
    switch (browserModeStr) {
	  case 'phone':
	    browser.driver.manage().window().setSize(430, 667);
      break;
	  case 'tablet':
        browser.driver.manage().window().setSize(768, 1024);
      break;
      case 'desktop':
        browser.driver.manage().window().setSize(1920, 1080);
    } 
  },

/**
 * Set the windows in which the tests will run 
 */
  setTestSpace: function (page) {
    page.clickOnSpaceDropdown();
    page.selectSpaceDropDownValue("1");
  },

  /** 
  * Write screenshot to file 
  * Example usage:
  *    browser.takeScreenshot().then(function (png) {
  *      testSupport.writeScreenShot(png, 'exception.png');
  *  });
  * 
  * Ref: http://blog.ng-book.com/taking-screenshots-with-protractor/
  */ 
  writeScreenShot: function(data, filename) {
    var fs = require('fs');
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  },

/*
 * Custom wait function - determine if ANY text appears in a field's value
 */
waitForText: function (elementFinder) {
    return elementFinder.getAttribute("value").then(function(text) {
//      console.log("text = " + text);
      return text !== "";  // could also be replaced with "return !!text;"
    });
  },

  /* 
  * Get system time in seconds since 1970 
  */
  returnTime: function () {

    var month = new Array();
    month[0] = "jan";
    month[1] = "feb";
    month[2] = "mar";
    month[3] = "apr";
    month[4] = "may";
    month[5] = "jun";
    month[6] = "jul";
    month[7] = "aug";
    month[8] = "sep";
    month[9] = "oct";
    month[10] = "nov";
    month[11] = "dec";

    var d = new Date();
    var m = month[d.getMonth()];
    var day = d.getDate(); 
    var n = d.getTime();
 
    console.log ("EE POC test - Creating space: " + m + day.toString() + n.toString());
    return "test" +  m + day.toString() + n.toString();
  },

  /*
  * Switch to browser window - used to access Che browser window
  */
    switchToWindow: function (browser, windowNumber) {
     var constants = require("./constants");
      browser.sleep(constants.WAIT);
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[windowNumber]);
      });
  },

  /* 
  * Log user into OSIO, clean user account, update tenant 
  */
  loginCleanUpdate: function (page, username, password) {

  var OpenShiftIoStartPage = require('./page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('./page-objects/openshift-io-github-login.page'),
    OpenShiftIoSpaceHomePage = require('./page-objects/openshift-io-spacehome.page'),
    OpenShiftIoDashboardPage = require('./page-objects/openshift-io-dashboard.page'),
    OpenShiftIoRegistrationPage = require('./page-objects/openshift-io-registration.page'),
    OpenShiftIoPipelinePage = require('./page-objects/openshift-io-pipeline.page'),
    OpenShiftIoCodebasePage = require('./page-objects/openshift-io-codebase.page'),
    OpenShiftIoChePage = require('./page-objects/openshift-io-che.page'),
    OpenShiftProfilePage = require('./page-objects/openshift-io-profile.page'),
    OpenShiftUpdateProfilePage = require('./page-objects/openshift-io-update-profile.page'),
    OpenShiftIoCleanTenantPage = require('./page-objects/openshift-io-clean-tenant.page'),
    constants = require("./constants");

    var until = protractor.ExpectedConditions;

    OpenShiftIoRHDLoginPage = page.clickLoginButton();
    OpenShiftIoRHDLoginPage.clickRhdUsernameField();
    OpenShiftIoRHDLoginPage.typeRhdUsernameField(browser.params.login.user);
    OpenShiftIoRHDLoginPage.clickRhdPasswordField();
    OpenShiftIoRHDLoginPage.typeRhdPasswordField(browser.params.login.password);
    OpenShiftIoDashboardPage = OpenShiftIoRHDLoginPage.clickRhdLoginButton();

    var process = require('child_process').execSync;
    var result = process('sh ./local_cleanup_che.sh ' + browser.params.login.user + ' ' + browser.params.kc.token).toString();
    console.log(result);

    process = require('child_process').execSync;
    result = process('sh ./local_cleanup.sh ' + browser.params.login.user + ' ' + browser.params.oso.token).toString();
    console.log(result);

    /* Wait until the Jenkins status icon indicates that the Jenkins pod is running. */
    OpenShiftIoDashboardPage.clickStatusIcon();
    browser.wait(until.presenceOf(OpenShiftIoDashboardPage.cheStatusPoweredOn), constants.RESET_TENANT_WAIT, "Timeout waiting for Che to start after tenant update - see: https://github.com/openshiftio/openshift.io/issues/595");
    browser.wait(until.presenceOf(OpenShiftIoDashboardPage.jenkinsStatusPoweredOn), constants.RESET_TENANT_WAIT), "Timeout waiting for Jenkis to start after tenant update - see: https://github.com/openshiftio/openshift.io/issues/595";
    browser.sleep(constants.WAIT);
    return OpenShiftIoDashboardPage;
  },

  /* 
  * Log user into OSIO, clean user account, update tenant 
  */
  loginCleanUpdateNuke: function (page, username, password) {
    
      var OpenShiftIoStartPage = require('./page-objects/openshift-io-start.page'),
        OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page'),
        OpenShiftIoGithubLoginPage = require('./page-objects/openshift-io-github-login.page'),
        OpenShiftIoSpaceHomePage = require('./page-objects/openshift-io-spacehome.page'),
        OpenShiftIoDashboardPage = require('./page-objects/openshift-io-dashboard.page'),
        OpenShiftIoRegistrationPage = require('./page-objects/openshift-io-registration.page'),
        OpenShiftIoPipelinePage = require('./page-objects/openshift-io-pipeline.page'),
        OpenShiftIoCodebasePage = require('./page-objects/openshift-io-codebase.page'),
        OpenShiftIoChePage = require('./page-objects/openshift-io-che.page'),
        OpenShiftProfilePage = require('./page-objects/openshift-io-profile.page'),
        OpenShiftUpdateProfilePage = require('./page-objects/openshift-io-update-profile.page'),
        OpenShiftIoCleanTenantPage = require('./page-objects/openshift-io-clean-tenant.page'),
        constants = require("./constants");
    
        var until = protractor.ExpectedConditions;
    
        OpenShiftIoRHDLoginPage = page.clickLoginButton();
        OpenShiftIoRHDLoginPage.clickRhdUsernameField();
        OpenShiftIoRHDLoginPage.typeRhdUsernameField(browser.params.login.user);
        OpenShiftIoRHDLoginPage.clickRhdPasswordField();
        OpenShiftIoRHDLoginPage.typeRhdPasswordField(browser.params.login.password);
        OpenShiftIoDashboardPage = OpenShiftIoRHDLoginPage.clickRhdLoginButton();
        
        /* Clean the user account in OSO with the new clean tenant button */
        OpenShiftIoDashboardPage.clickrightNavigationBar();
    
        /* Access the profile page */
        OpenShiftProfilePage = OpenShiftIoDashboardPage.clickProfile();
    
        /* Access the update profile page */
        OpenShiftUpdateProfilePage = OpenShiftProfilePage.clickupdateProfileButton();

//        OpenShiftUpdateProfilePage.obtainToken.getText().then(function(text){
//          console.log("Token = " + text);
//        });
    
        /* Access the clean the tenant page */
        OpenShiftIoCleanTenantPage = OpenShiftUpdateProfilePage.clickCleanTenantButton();
        browser.sleep(constants.WAIT);
        OpenShiftIoCleanTenantPage.clickEraseOsioEnvButton();
        OpenShiftIoCleanTenantPage.clickEraseOsioEnvUsername();
        OpenShiftIoCleanTenantPage.typeEraseOsioEnvUsername(browser.params.login.user);
        OpenShiftIoCleanTenantPage.clickConfirmEraseOsioEnvButton();
    
        /* Return to the account home page */
        OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
        browser.sleep(constants.WAIT);
        OpenShiftIoDashboardPage.clickAccountHomeUnderLeftNavigationBar();
        
        /* The user's account is cleaned before the test runs. Th etest must now Update the user's tenant, and
           wait until Che and Jenkins pods are running before starting the test. */
        OpenShiftIoDashboardPage.clickrightNavigationBar();
    
        /* Access the profile page */
        OpenShiftProfilePage = OpenShiftIoDashboardPage.clickProfile();
    
        /* Access the update profile page */
        OpenShiftUpdateProfilePage = OpenShiftProfilePage.clickupdateProfileButton();
    
        /* Update the tenant */
        OpenShiftUpdateProfilePage.clickupdateTenantButton();
    
        OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
        browser.sleep(constants.WAIT);
        OpenShiftIoDashboardPage.clickAccountHomeUnderLeftNavigationBar();
    
        /* Wait until the Jenkins status icon indicates that the Jenkins pod is running. */
        OpenShiftIoDashboardPage.clickStatusIcon();
        browser.wait(until.presenceOf(OpenShiftIoDashboardPage.cheStatusPoweredOn), constants.LONGEST_WAIT, "Timeout waiting for Che to start after tenant update - see: https://github.com/openshiftio/openshift.io/issues/595");
        browser.wait(until.presenceOf(OpenShiftIoDashboardPage.jenkinsStatusPoweredOn), constants.LONGEST_WAIT), "Timeout waiting for Jenkis to start after tenant update - see: https://github.com/openshiftio/openshift.io/issues/595";
        browser.sleep(constants.LONG_WAIT);
    //    browser.sleep(constants.RESET_TENANT_WAIT);
    
        return OpenShiftIoDashboardPage;
    
      },


  /* 
  * Create new space for user 
  */
  createNewSpace: function (page, spaceName, username, password, targetUrl) {

   var constants = require("./constants"),
     OpenShiftIoSpaceHomePage = require('./page-objects/openshift-io-spacehome.page');
   var until = protractor.ExpectedConditions;

    page.clickHeaderDropDownToggle();
    browser.sleep(constants.WAIT);
    page.clickCreateSpaceUnderLeftNavigationBar();  

    page.typeNewSpaceName((spaceName));
    page.typeDevProcess("Scenario Driven Planning");
    page.clickCreateSpaceButton();   

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    page.waitForToastToClose();
    OpenShiftIoSpaceHomePage = page.clickNoThanksButton();

    /* In the space home page, verify URL and end the test */
    browser.wait(until.urlContains(targetUrl + '/' + username + '/'+ spaceName), constants.WAIT);
    browser.wait(until.urlIs(targetUrl + '/' + username + '/'+ spaceName), constants.WAIT); 
    expect(browser.getCurrentUrl()).toEqual(targetUrl + '/' + username + '/'+ spaceName);

    browser.getCurrentUrl().then(function (text) { 
       console.log ('EE POC test - new space URL = ' + text);
    });

    page.waitForToastToClose();
    return OpenShiftIoSpaceHomePage;
  },

/* 
  * Create new quickstart - accept ALL defaults 
  */
  createQuickstartDefaults: function (OpenShiftIoSpaceHomePage, OpenShiftIoDashboardPage) {    

    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage.clickPrimaryAddToSpaceButton();  

    OpenShiftIoSpaceHomePage.clickTechnologyStack();
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 1/4
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 2/4
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 3/4
    OpenShiftIoSpaceHomePage.clickQuickStartFinishButton2();
    OpenShiftIoSpaceHomePage.clickOkButton();

    /* Trap 'Application Generation Error' here - if found, fail test and exit */
    expect(OpenShiftIoDashboardPage.appGenerationError.isPresent()).toBe(false);
    OpenShiftIoDashboardPage.waitForToastToClose();
  },
        
 /* 
  * Create new quickstart - import - accept ALL defaults 
  */
  importProjectDefaults: function (OpenShiftIoSpaceHomePage, OpenShiftIoDashboardPage, projectName) {    

    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage.clickPrimaryAddToSpaceButton();  

    OpenShiftIoSpaceHomePage.clickImportCodebaseButton();
    OpenShiftIoSpaceHomePage.clickImportCodebaseByName (projectName);
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2();  // End of dialog page 2/3
    OpenShiftIoSpaceHomePage.clickQuickStartFinishButton2();
    OpenShiftIoSpaceHomePage.clickOkButton();

    /* Trap 'Application Generation Error' here - if found, fail test and exit */
    expect(OpenShiftIoDashboardPage.appGenerationError.isPresent()).toBe(false);
    OpenShiftIoDashboardPage.waitForToastToClose();    
  },

 /* 
  * Create new quickstart - select quickstart by name
  */
  createQuickstartByNameDefaults: function (OpenShiftIoSpaceHomePage, OpenShiftIoDashboardPage, quickstartName) {    

    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage.clickPrimaryAddToSpaceButton();  
    OpenShiftIoSpaceHomePage.clickTechnologyStack();
 
    // Select quickstart by name
    OpenShiftIoSpaceHomePage.clickQuickStartList();
    OpenShiftIoSpaceHomePage.clickQuickStartByName (quickstartName);
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 1/4
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 2/4
    OpenShiftIoSpaceHomePage.clickQuickStartNextButton2()  // End of dialog page 3/4
    OpenShiftIoSpaceHomePage.clickQuickStartFinishButton2();
    OpenShiftIoSpaceHomePage.clickOkButton();

    /* Trap 'Application Generation Error' here - if found, fail test and exit */
    expect(OpenShiftIoDashboardPage.appGenerationError.isPresent()).toBe(false);
    OpenShiftIoDashboardPage.waitForToastToClose();
  },

 /*
  * Create a new codespace
  */
  createCodebase: function  (OpenShiftIoDashboardPage, username, spaceTime, GITHUB_NAME) {
  
    var OpenShiftIoChePage = require('./page-objects/openshift-io-che.page'),
    OpenShiftIoCodebasePage = require('./page-objects/openshift-io-codebase.page'),
    constants = require("./constants");
    var until = protractor.ExpectedConditions;

    /* Start by creating a codebase for the newly created project */
    browser.sleep(constants.LONG_WAIT);
    OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
    browser.sleep(constants.WAIT);
    OpenShiftIoDashboardPage.clickAccountHomeUnderLeftNavigationBar();
 
    /* Go to the Create page - https://openshift.io/almusertest1/testmay91494369460731/create  */
    browser.get(browser.params.target.url + "/" + browser.params.login.user + "/" + spaceTime + "/create");
    OpenShiftIoCodebasePage = new OpenShiftIoCodebasePage();

    OpenShiftIoCodebasePage.codebaseList.getText().then(function(text){
      console.log("Codebases page contents = " + text);
    });

    browser.wait(until.elementToBeClickable(OpenShiftIoCodebasePage.codebaseByName (browser.params.login.user, spaceTime, GITHUB_NAME)), constants.WAIT, 'Failed to find CodebaseByName');
    OpenShiftIoCodebasePage.codebaseByName (browser.params.login.user, spaceTime, GITHUB_NAME).getText().then(function(text){
      console.log("Codebase = " + text);
    });

    OpenShiftIoCodebasePage.clickCreateCodebaseKebab();
    OpenShiftIoChePage = OpenShiftIoCodebasePage.clickCreateCodebaseIcon();
    return OpenShiftIoChePage;
  },


 /*
  * Create a new codespace for an imported project
  */
  createCodebaseImport: function  (OpenShiftIoDashboardPage, username, spaceTime, GITHUB_NAME, IMPORT_NAME) {
    
      var OpenShiftIoChePage = require('./page-objects/openshift-io-che.page'),
      OpenShiftIoCodebasePage = require('./page-objects/openshift-io-codebase.page'),
      constants = require("./constants");
      var until = protractor.ExpectedConditions;
  
    browser.sleep(constants.LONG_WAIT);
    OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
    browser.sleep(constants.WAIT);
    OpenShiftIoDashboardPage.clickAccountHomeUnderLeftNavigationBar();
 
    /* Go to the Create page - https://openshift.io/almusertest1/testmay91494369460731/create  */
    browser.get(browser.params.target.url + "/" + browser.params.login.user + "/" + spaceTime + "/create");
    OpenShiftIoCodebasePage = new OpenShiftIoCodebasePage();
    
    OpenShiftIoCodebasePage.codebaseList.getText().then(function(text){
      console.log("Codebases page contents = " + text);
    });

    browser.wait(until.elementToBeClickable(OpenShiftIoCodebasePage.codebaseByName (browser.params.login.user, IMPORT_NAME, GITHUB_NAME)), constants.WAIT, 'Failed to find CodebaseByName');
    OpenShiftIoCodebasePage.codebaseByName (browser.params.login.user, IMPORT_NAME, GITHUB_NAME).getText().then(function(text){
      console.log("Codebase = " + text);
    });

    OpenShiftIoCodebasePage.clickCreateCodebaseKebab();
    OpenShiftIoChePage = OpenShiftIoCodebasePage.clickCreateCodebaseIcon();


      return OpenShiftIoChePage;
    },
  
  



/* 
  * Log user out of OSIO
  */
  logoutUser: function (page) {

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    page.waitForToastToClose();
    page.clickrightNavigationBar();
    page.clickLogOut();
  },


/*
 * Create fixed length string - used to generate large strings
 */
generateString: function (size, newlines) {
  var sourceString128 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()\|;:',./<>?`~Ω≈ç√∫˜µ≤≥÷åß∂ƒ©˙∆˚¬…æœ∑´®†¥¨ˆøπ¡™£¢∞§¶•ªº–≠";
  var retString = "";
  var counter = size / 128;
  if (counter < 1) {
    counter = 1;
  } 
  for (var i = 0; i < counter; i++) {
    retString += sourceString128;
    if (newlines) {
      retString += "\n";
    }
  }
  // console.log ("return string ="  + retString);
  return retString;
}


};
