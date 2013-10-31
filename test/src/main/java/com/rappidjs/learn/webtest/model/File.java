package com.rappidjs.learn.webtest.model;

/**
 * User: tony
 * Date: 31.10.13
 * Time: 11:56
 */
public class File {

    protected String fileName;
    protected String content;

    public File(String fileName) {
        this.fileName = fileName;
    }

    public File(String fileName, String content) {
        this.fileName = fileName;
        this.content = content;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        File file = (File) o;

        if (content != null ? !content.equals(file.content) : file.content != null)
            return false;
        if (!fileName.equals(file.fileName)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = fileName.hashCode();
        result = 31 * result + (content != null ? content.hashCode() : 0);
        return result;
    }
}
