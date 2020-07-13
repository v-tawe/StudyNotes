import java.util.*;

/**
 * @ClassName CollectionTest
 * @Description TODO
 * @Author davidt
 * @Date 7/9/2020 2:06 PM
 * @Version 1.0
 **/
public class CollectionTest {
    public static void main(String[] args) {
        MyClass a = new MyClass(2, "a");

        Collection<MyClass> lists = new ArrayList<>();
        lists.add(new MyClass(1, "kiss"));
        lists.add(new MyClass(1, "kiss"));
        lists.add(a);
        lists.add(a);

        Collection<MyClass> sets = new HashSet<>();
        sets.add(new MyClass(1, "kiss"));
        sets.add(new MyClass(1, "kiss"));
        sets.add(a);
        sets.add(a);

        Collection<MyClass> trees = new TreeSet<>(new Comparator<MyClass>() {
            @Override
            public int compare(MyClass o1, MyClass o2) {
                return o1.getId().equals(o2.getId()) ? 0 : 1;
            }
        });
        trees.add(new MyClass(1, "kiss"));
        trees.add(new MyClass(1, "kiss"));
        trees.add(a);
        trees.add(a);
        trees.add(new MyClass(2, "kiss"));

        System.out.println(lists);
        System.out.println(sets);
        System.out.println(trees);

//        Scanner scanner = new Scanner(System.in);
//        List list = new ArrayList();
//        for (int i=0; i<10; i++) {
//            list.add(scanner.nextInt());
//        }

        List list = new ArrayList();
        for (int i = 0; i < 10; i++) {
            list.add(i);
        }

        Collections.sort(list);
        System.out.println(list);
        Collections.reverse(list);
        System.out.println(list);
//        List list2 = new ArrayList(list.size());
        List list2 = Collections.unmodifiableList(list);
        List list3 = List.copyOf(list2);
        System.out.println(list2.size());
        System.out.println(list3.size());
        Collections.copy(list2, list);


    }
}

class MyClass {
    private String name;
    private Integer id;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public MyClass(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return "MyClass{" +
                "name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
