package com.rappidjs.learn.webtest.ui;

import io.rappid.webtest.rappidjs.js.ui.Dialog;
import org.openqa.selenium.By;

/**
 * User: tony
 * Date: 31.10.13
 * Time: 11:54
 */
public class NewFileDialog extends Dialog {
    public NewFileDialog() {
        super(By.cssSelector(".modal > .new-file"));
    }
}