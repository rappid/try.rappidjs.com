package com.rappidjs.learn.webtest;

import com.rappidjs.learn.webtest.model.File;
import com.rappidjs.learn.webtest.ui.Project;
import io.rappid.webtest.testng.TestDevelopment;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

/**
 * User: tony
 * Date: 26.10.13
 * Time: 17:03
 */
public class WebTest extends io.rappid.webtest.common.WebTest {

    /***
     * Tests the initial interface
     */
    @Test()
    public void InitialTest() {

        IndexPage indexPage = getIndexPage();
        Project project = indexPage.sideBar().project();

        Assert.assertEquals(project.headline(), "Project");

        List<File> files = project.getFiles();

        Assert.assertEquals(files.size(), 2);
        Assert.assertEquals(files.get(0).getFileName(), "app/App.xml");
        Assert.assertEquals(files.get(1).getFileName(), "app/AppClass.js");

        Assert.assertEquals(files.get(0), project.getActiveFile());
    }

    @Test
    @TestDevelopment
    public void CheckTabSwitch() {

        IndexPage indexPage = getIndexPage();
        Project project = indexPage.sideBar().project();
        IndexPage.CodeView codeView = indexPage.codeView();

        List<File> files = project.getFiles();

        Assert.assertEquals(files.size(), 2);
        Assert.assertEquals(files.get(0), project.getActiveFile());
        Assert.assertEquals(codeView.getActiveTab().getLabel().trim(), "app/App.xml");

        project.selectFile(files.get(1));

        Assert.assertEquals(codeView.getActiveTab().getLabel().trim(), "app/AppClass.js");

    }


    protected IndexPage getIndexPage() {
        driver().get(getStartUrl());
        return new IndexPage();
    }

    @Override
    public String getStartUrl() {
        return getParameter("startUrl");
    }
}
