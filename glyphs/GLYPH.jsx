var doc = app.activeDocument;
var sel = doc.selection;

if(sel.length != 1){
    alert("لطفاً فقط یک آبجکت را به عنوان مادر انتخاب کنید.");
} else {
    var master = sel[0]; // آبجکت مادر

    // گرفتن لایه اصلی (تمام آیتم‌ها داخل این لایه هستند)
    var mainLayer = master.layer;

    // لیست آبجکت‌ها و گروه‌های سطح اصلی (parent = layer) به جز مادر
    var itemsToGroup = [];
    for(var i=0; i<mainLayer.pageItems.length; i++){
        var item = mainLayer.pageItems[i];
        if(item != master && item.parent == mainLayer){
            itemsToGroup.push(item);
        }
    }

    // تک‌تک آیتم‌ها با کپی مادر گروپ می‌شوند
    for(var j=0; j<itemsToGroup.length; j++){
        var obj = itemsToGroup[j];

        // ایجاد کپی مادر
        var masterCopy = master.duplicate();

        // ایجاد گروه جدید
        var grp = doc.groupItems.add();

        // اضافه کردن کپی مادر و آبجکت/گروه به گروه
        masterCopy.move(grp, ElementPlacement.PLACEATEND);
        obj.move(grp, ElementPlacement.PLACEATEND);

        // محاسبه مرکز آبجکت/گروه
        var objCenterX = obj.left + obj.width/2;
        var objCenterY = obj.top - obj.height/2;

        // محاسبه مرکز کپی مادر
        var masterCenterX = masterCopy.left + masterCopy.width/2;
        var masterCenterY = masterCopy.top - masterCopy.height/2;

        // جابجایی کپی مادر به مرکز آبجکت/گروه
        masterCopy.translate(objCenterX - masterCenterX, objCenterY - masterCenterY);
    }

    alert("تمام آیتم‌های سطح اصلی لایه با کپی مادر گروپ شدند.");
}
