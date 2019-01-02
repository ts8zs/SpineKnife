function amputateSpineObj(spineObj, byParts) {
    function getFirstPartOf(str) {
        return str.split('-')[0];
    }
    var partSetObj = {};
    partSetObj['skeleton'] = spineObj['skeleton'];

    partSetObj['bones'] = spineObj['bones'].filter(function (bone) {
        return getFirstPartOf(bone.name) == byParts;
    });
    partSetObj['slots'] = spineObj['slots'].filter(function (slot) {
        return getFirstPartOf(slot.name) == byParts;
    });

    partSetObj['skins'] = {};
    partSetObj['skins']['default'] = {};

    for (var partName in spineObj['skins']['default']) {
        if (getFirstPartOf(partName) == byParts) {
            partSetObj['skins']['default'][partName] = spineObj['skins']['default'][partName];
            for (const slotName in partSetObj['skins']['default'][partName]) {
                if (partSetObj['skins']['default'][partName].hasOwnProperty(slotName)) {
                    const slot = partSetObj['skins']['default'][partName][slotName];
                    if (slot.vertices) {
                        if (slot.vertices.length > slot.uvs.length) {
                            for (let index = 0; index < slot.vertices.length; index += (slot.vertices[index] * 4 + 1)) {
                                for (let time = 0; time < slot.vertices[index]; time++) {
                                    let offset = time * 4 + 1;
                                    slot.vertices[index + offset] = spineObj['bones'][slot.vertices[index + offset]]['name'];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    partSetObj['animations'] = {};
    for (var aniName in spineObj['animations']) {
        partSetObj['animations'][aniName] = {};
        for (propName in spineObj['animations'][aniName]) {
            partSetObj['animations'][aniName][propName] = {};
            if (propName == "deform") {
                if (!partSetObj['animations'][aniName][propName]['default']) {
                    partSetObj['animations'][aniName][propName]['default'] = {};
                }
                for (partName in spineObj['animations'][aniName][propName]['default']) {
                    if (getFirstPartOf(partName) == byParts) {
                        partSetObj['animations'][aniName][propName]['default'][partName] = spineObj['animations'][aniName][propName]['default'][partName];
                    }
                }
            } else {
                for (partName in spineObj['animations'][aniName][propName]) {
                    if (getFirstPartOf(partName) == byParts) {
                        partSetObj['animations'][aniName][propName][partName] = spineObj['animations'][aniName][propName][partName];
                    }
                }
            }
        }
    }
    return partSetObj;
}

var rules = [
    "eye-brow", "eye-blow", "hair-f", "eye", "mouth", "body-head", "body-neck", "body", "body-bottom", "hair-b", "hair"
]

//@param spineObj...
function sutureSpineObj() {
    function slotSortRule(a, b) {
        function getWeightOf(name) {
            for (let weight = 0; weight < rules.length; weight++) {
                const rule = rules[weight];
                if (name.indexOf(rule) == 0) {
                    return weight;
                }
            }
        }

        var aWeight = getWeightOf(a.name),
            bWeight = getWeightOf(b.name);
        if (aWeight > bWeight)
            return 1;
        if (aWeight < bWeight)
            return -1;
        return 0;
    }

    function boneSortRule(a, b) {
        var rules = [
            "root", "body", "hair"
        ]

        function getWeightOf(name) {
            for (let weight = 0; weight < rules.length; weight++) {
                const rule = rules[weight];
                if (name.indexOf(rule) == 0) {
                    return weight;
                }
            }
        }
        var aWeight = getWeightOf(a.name),
            bWeight = getWeightOf(b.name);
        if (aWeight > bWeight)
            return 1;
        if (aWeight < bWeight)
            return -1;
        return 0;
    }
    var partSetObj = {};
    partSetObj['skeleton'] = {
        "hash": "ts8zs",
        "spine": "3.6.52",
        "images": "./images/"
    }
    partSetObj['bones'] = [{
        "name": "root"
    }]
    for (let key = 0; key < arguments.length; key++) {
        const spineObj = arguments[key];
        _.mergeWith(partSetObj, spineObj, function (objValue, srcValue) {
            if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        });
    }

    function insertionSort(arr, fn) {
        var len = arr.length;
        var preIndex, current;
        var fn = fn || function (a, b) {
            return a > b;
        }
        for (var i = 1; i < len; i++) {
            preIndex = i - 1;
            current = arr[i];
            while (preIndex >= 0 && (fn(arr[preIndex], current) == 1)) {
                arr[preIndex + 1] = arr[preIndex];
                preIndex--;
            }
            arr[preIndex + 1] = current;
        }
        return arr;
    }
    insertionSort(partSetObj['slots'], function (a, b) { return 0 - slotSortRule(a, b); });
    insertionSort(partSetObj['bones'], boneSortRule);
    for (var partName in partSetObj['skins']['default']) {
        for (const slotName in partSetObj['skins']['default'][partName]) {
            if (partSetObj['skins']['default'][partName].hasOwnProperty(slotName)) {
                const slot = partSetObj['skins']['default'][partName][slotName];
                if (slot.vertices) {
                    if (slot.vertices.length > slot.uvs.length) {
                        for (let index = 0; index < slot.vertices.length; index++) {
                            if (typeof (slot.vertices[index]) == "string") {
                                a = partSetObj.bones.findIndex(function (a) {
                                    return a.name == slot.vertices[index]
                                });
                                slot.vertices[index] = a;
                            }
                        }
                    }
                }
            }
        }
    }

    return partSetObj;
}


/*
使用方法

肢解
function amputateSpineObj(spineObj, byParts)
fliter a spine model to a spine model only have byParts' prefix elements
need to do this many time to fliter all the prefix

将spine对象过滤为只有byParts字符串开头的spine对象
过滤多个则需要多次拆分

缝合
需要lodash环境 lodash needed
排序需要修改rule
function sutureSpineObj(spineObjs...)
the order of the elements could be control by the global var 'rule'
by the order to make many spine model together
将多个spine对象按排序规则组合到一起。

*/

