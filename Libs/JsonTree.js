var getJsonTree = function(data, parentId) {
    var itemArr = [];
    for (var i = 0; i < data.length; i++) {
        var node = data[i];
        if (node.parentId == parentId) {
            var newNode = {};
            newNode.id = node.id;
            newNode.name = node.name;
            newNode.url = node.url;
            newNode.icon = node.icon;
            newNode.nodes = getJsonTree(data, node.id);
            itemArr.push(newNode);
        }
    }
    return itemArr;
};
module.exports= getJsonTree;