# 集合

## Collection

- Collection
  - List - 有序的，可重复
    `equals()` 方法进行排序
    - ArrayList : 非线程安全，使用数组存储
    - LinkedList : 双向链表存储
    - Vector : 线程安全，使用数组存储
  - Set - 无序的，不可重复的
    - HashSet : 非线程安全，数组+链表共同实现 - 插入时根据 HashCode 判断是否有重复值
      通过 `equals()` 及 `hashCode()` 进行排序
      - LinkedHashSet ： 按照插入的顺序进行排序 - 数据结构和 HashSet 一样，但是添加数据时会同时添加 2 个属性记录前后值从而实现顺序的记录，用于频繁遍历
    - TreeSet - 可以按照指定属性进行排序，添加的对象需要是同一个类
      **必须**通过 `Comparable` 的 `CompareTo()` 及 `Comparator` 的 `Compare()` 方法进行排序

## Map

- Map
  - HashMap - 非线程安全，数组 + 链表 + 红黑树(JDK 1.8)
    - LinkedHashMap - 可以按照添加的顺序遍历，用于频繁遍历 - 多了 `before` & `after` Entry 记录
  - Hashtable - 线程安全
  - CurrentHashMap - 线程安全
  - TreeMap - 根据 key 进行排序，实现排序遍历
  - Properties - 处理配置文件，`key` 和 `value` 都是 `String`

HashMap:

- 默认容量：16
- 默认加载因子：0.75 - 决定数据的密度，负载因子越大，密度越大，链表越容易长
- 扩容临界值：16\*0.75=12
- 树形结构形成的规则：达到扩容临界值 & 该次数据需要插入的位置不为 `null` & 数组长度 > 64
- 红黑树形成的规则：链表形式的个数 > 8 & 当前数组长度 > 64

## Collections 工具类

- sort - 排序
- reverse - 反转
- copy(List desc, List src) - 复制, desc 长度必须大于 src
- List list2 = unmodifiableList(List list) - 复制
