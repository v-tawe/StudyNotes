import java.lang.reflect.Proxy;

interface Graph {
    void display();
}

public class DynamicProxy {
    public static void main(String[] args) {
        MyDynamicProxy proxy = new MyDynamicProxy();
        Rectangle rectangle = new Rectangle();
        proxy.bind(rectangle);

        Graph MyProxy = (Graph) proxy.getProxy();
        MyProxy.display();

        System.out.println("**************");

        MyDynamicProxy<Circle> myDynamicProxy = new MyDynamicProxy();
        myDynamicProxy.bind(new Circle());
        Graph graph = (Graph)myDynamicProxy.getProxy();
        graph.display();
    }
}

class Rectangle implements Graph {

    @Override
    public void display() {
        System.out.println("rectange.display");
    }
}

class Circle implements Graph {

    @Override
    public void display() {
        System.out.println("Circle.display");
    }
}

class MyDynamicProxy<T> {
    T obj;

    void bind(T obj) {
        this.obj = obj;
    }

    Object getProxy() {
        return Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj.getClass().getInterfaces(),
                (proxy, method, args) -> method.invoke(obj, args));
    }
}