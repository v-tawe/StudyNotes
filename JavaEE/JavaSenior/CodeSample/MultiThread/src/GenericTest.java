import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName GenericTest
 * @Description TODO
 * @Author davidt
 * @Date 7/9/2020 5:14 PM
 * @Version 1.0
 **/
public class GenericTest<T> {

    private T t;

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }

    public <E> List<E> getListE(E e) {
        ArrayList<E> es = new ArrayList<>();
        es.add(e);
        return es;
    }

    public List<T> getListT(T e) {
        ArrayList<T> es = new ArrayList<>();
        es.add(e);
        return es;
    }

    public static void main(String[] args) {
        GenericTest<Integer> genericTest = new GenericTest<>();
        List<Integer> list = genericTest.getListT(1);
        List<String> list2 = genericTest.getListE("1");
        System.out.println(list);
        System.out.println(list2);
    }
}
