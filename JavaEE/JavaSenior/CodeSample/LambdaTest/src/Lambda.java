import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class Lambda {
    public static void main(String[] args) {

        Demo demo = new Demo();
        demo.demo1("consumer", s -> System.out.println(s));
        demo.demo1("consumer2", System.out::println);
        String str = demo.demo2(() -> "my supplier");
        System.out.println(str);
        String str2 = demo.demo3(2, i -> i.toString());
        System.out.println(str2);
        Boolean bool = demo.demo4(true, b -> b);
        System.out.println(bool);
    }
}

class Demo {

    public void demo1(String s, Consumer<String> con) {
        con.accept(s);
    }

    public String demo2(Supplier<String> sup) {
        return sup.get();
    }

    public String demo3(Integer i, Function<Integer, String> fun) {
        return fun.apply(i);
    }

    public boolean demo4(Boolean b, Predicate<Boolean> pre) {
        return pre.test(b);
    }
}
