package com.rappidjs.learn.webtest;

import com.rappidjs.learn.webtest.model.File;
import com.rappidjs.learn.webtest.ui.NewFileDialog;
import io.rappid.webtest.common.PageObject;
import io.rappid.webtest.common.WebElementPanel;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

/**
 * User: tony
 * Date: 31.10.13
 * Time: 11:41
 */
public class IndexPage extends PageObject {
    @Override
    protected void validate() {
    }

    public SideBar sideBar() {
        return new SideBar(getChild("#sidebar"));
    }

    public class SideBar extends WebElementPanel{
        public SideBar(WebElement webElement) {
            super(webElement);
        }

        public Project project() {
            return new Project(getChild("li"));
        }
    }

    public class Project extends WebElementPanel {
        public Project(WebElement webElement) {
            super(webElement);
        }

        public String headline() {
            return getChild("h2").getText();
        }

        public NewFileDialog addNewFile() {
            getChild("a").click();
            return new NewFileDialog();
        }

        private File getFileFromWebElement(WebElement webElement) {
            return new File(webElement.findElement(By.cssSelector("a")).getText());
        }

        public List<File> getFiles() {

            ArrayList<File> files = new ArrayList<File>();
            List<WebElement> children = getChildren(".files > div");

            for (int i = 0; i < children.size(); i++) {
                files.add(getFileFromWebElement(children.get(i)));
            }

            return files;
        }

        public File getActiveFile() {
            WebElement child = getChild(By.cssSelector(".files .active"));

            if (child != null) {
                return getFileFromWebElement(child);
            }

            return null;

        }
    }

}
