package com.rappidjs.learn.webtest.ui;

import io.rappid.webtest.rappidjs.js.ui.Button;
import io.rappid.webtest.rappidjs.js.ui.Checkbox;
import io.rappid.webtest.rappidjs.js.ui.Dialog;
import io.rappid.webtest.rappidjs.js.ui.field.Text;
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

    public Text classNameText() {
        return getChildPanel(".control-group:nth-child(1)", Text.class);
    }

    public Text parentClassNameText() {
        return getChildPanel(".control-group:nth-child(2)", Text.class);
    }

    public Checkbox xamlCheckbox() {
        return getChildPanel("input[type='checkbox']", Checkbox.class);
    }

    public Button modelButton() {
        return getButton("Model");
    }

    public Button componentButton() {
        return getButton("Component");
    }

    public Button moduleButton() {
        return getButton("Module");
    }

    public Button cancelButton() {
        return getChildPanel(".modal-footer .btn", Button.class);
    }

    public Button createButton() {
        return getChildPanel(".modal-footer .btn-success", Button.class);
    }

    private Button getButton(String title) {
        return getChildPanel(String.format(".btn[title='%s']", title), Button.class);
    }
}