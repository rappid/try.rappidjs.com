package com.rappidjs.learn.webtest.ui;

import com.rappidjs.learn.webtest.model.File;
import io.rappid.webtest.common.WebElementPanel;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

/**
* User: tony
* Date: 31.10.13
* Time: 12:58
*/
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
        List<WebElement> children = getChildren();

        for (int i = 0; i < children.size(); i++) {
            files.add(getFileFromWebElement(children.get(i)));
        }

        return files;
    }

    private List<WebElement> getChildren() {
        return getChildren(".files > div");
    }

    public File getActiveFile() {
        WebElement child = getChild(By.cssSelector(".files .active"));

        if (child != null) {
            return getFileFromWebElement(child);
        }

        return null;

    }

    public void selectFile(File file) {

        List<WebElement> children = getChildren();
        for (int i = 0; i < children.size(); i++) {
            WebElement fileChildren = children.get(i);
            if (file.equals(getFileFromWebElement(fileChildren))) {
                fileChildren.findElement(By.cssSelector("a")).click();
                return;
            }
        }

        throw new RuntimeException(String.format("File %s not found", file.getFileName()));
    }
}
