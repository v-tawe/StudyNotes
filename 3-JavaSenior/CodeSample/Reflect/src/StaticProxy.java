public class StaticProxy {

    public static void main(String[] args) {
        MyProxy proxy = new MyProxy(new MyDemo());
        proxy.show();
    }
}

interface IMyProxy {
    void show();
    String create();
}

class MyProxy implements IMyProxy {

    MyDemo myDemo;

public MyProxy(MyDemo myDemo) {
    this.myDemo = myDemo;
}

    @Override
    public void show() {
        System.out.println("MyProxy.show");
        myDemo.show();
    }

    @Override
    public String create() {
        return "MyProxy create";
    }
}

class MyDemo implements IMyProxy {

    @Override
    public void show() {
        System.out.println("demo.show");
    }

    @Override
    public String create() {
        return "demo.create";
    }
}
