package com.rappidjs.learn.webtest.ui;

import io.rappid.webtest.common.WebElementPanel;
import org.openqa.selenium.WebElement;

/**
* User: tony
* Date: 31.10.13
* Time: 12:58
*/
public class SideBar extends WebElementPanel {
    public SideBar(WebElement webElement) {
        super(webElement);
    }

    public Project project() {
        return new Project(getChild("li"));
    }
}
