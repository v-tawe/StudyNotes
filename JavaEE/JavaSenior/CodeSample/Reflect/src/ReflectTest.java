import java.lang.reflect.Field;

/**
 * @ClassName ReflectTest
 * @Description TODO
 * @Author davidt
 * @Date 7/13/2020 5:05 PM
 * @Version 1.0
 **/
public class ReflectTest {
    public static void main(String[] args) throws Exception {
        Class<Demo> demoClass = Demo.class;
        Class<? extends Demo> demoClass1 = new Demo().getClass();
        Class<?> demoClass2 = Class.forName("Demo");
        Demo demo = demoClass.getDeclaredConstructor().newInstance();
        Demo kyss = demoClass.getDeclaredConstructor(int.class, String.class).newInstance(1, "kyss");
        System.out.println(demo);
        System.out.println(kyss);
        System.out.println(demoClass);
        System.out.println(demoClass1);
        System.out.println(demoClass2);
        System.out.println("===================");

        Field[] fields = demoClass.getFields();
        for (Field field : fields) {
            field.setAccessible(true);
        }
        demoClass.getDeclaredFields();
        demoClass.getSuperclass();
        demoClass.getDeclaredMethods();


    }
}

class Demo {
    private int id;
    private String name;

    public Demo() { }

    public Demo(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Demo{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
