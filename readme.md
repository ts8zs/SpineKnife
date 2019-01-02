
## function sutureSpineObj(spineObjs...)
the order of the elements could be control by the global var 'rule'
by the order to make many spine model together

## function amputateSpineObj(spineObj, byParts)
fliter a spine model to a spine model only have byParts' prefix elements
need to do this many time to fliter all the prefix

肢解 sutureSpineObj
将spine对象过滤为只有byParts字符串开头的spine对象
过滤多个则需要多次拆分

缝合 amputateSpineObj
需要lodash环境 lodash needed
排序需要修改rule
将多个spine对象按排序规则组合到一起。

