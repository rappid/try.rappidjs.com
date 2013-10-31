package com.rappidjs.learn.webtest;

import com.rappidjs.learn.webtest.ui.SideBar;
import io.rappid.webtest.common.PageObject;
import io.rappid.webtest.common.WebElementPanel;
import io.rappid.webtest.rappidjs.js.ui.TabView;
import org.openqa.selenium.WebElement;

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

    public CodeView codeView() {
        return new CodeView(getChild("#content .left"));
    }

    public class CodeView extends WebElementPanel{
        public CodeView(WebElement webElement) {
            super(webElement);
        }

        public TabView getActiveTab() {
            return new TabView(getChild("ul > li.active"), getChild(".tab-content"));
        }
    }
}
