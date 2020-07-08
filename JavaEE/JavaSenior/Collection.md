# 集合

- Collection
    - List - 有序的，可重复
        - ArrayList : 非线程安全，使用数组存储
        - LinkedList : 双向链表存储
        - Vector : 线程安全，使用数组存储
    - Set - 无序的，不可重复的
        - HashSet : 非线程安全，数组+链表共同实现 - 插入时根据 HashCode 判断是否有重复值
            - LinkedHashSet ： 按照插入的顺序进行排序 - 数据结构和 HashSet 一样，但是添加数据时会同时添加2个属性记录前后值从而实现顺序的记录
        - TreeSet - 可以按照指定属性进行排序，添加的对象需要是同一个类
- Map
    - HashMap - 
    - LinkedHashMap
    - TreeMap
    - HashTable
    - Properties