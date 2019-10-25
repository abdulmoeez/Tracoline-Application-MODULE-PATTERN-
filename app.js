// STORAGE CONTROLLER

// UI CONTROLLER
UICtrl = (function(){
    const UISelectors = {
        itemList: '.list-group',
        listItem: '.list-group-item',
        addBtn: '.btnAdd',
        btnEdit: '.btnEdit',
        btnDelete: '.btnDelete',
        btnBack: '.btnBack',
        btnClearAll: '.clearAll',
        mealName: '#mealName',
        mealCalories: '#mealCalories',
        totalCalories: '#totalCalories',
        editItem: '.editItem',
    }

    return{
        intialState: function(){
            document.querySelector(UISelectors.mealName).value = '';
            document.querySelector(UISelectors.mealCalories).value = '';
            document.querySelector(UISelectors.btnEdit).style.display = 'none';
            document.querySelector(UISelectors.btnBack).style.display = 'none';
            document.querySelector(UISelectors.btnDelete).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'block';
        },
        populateList : function(items){
            let html = '';
            items.forEach((item)=>{
                html += `
                <li class="list-group-item" id=${item.id}>
                    <div class="row">
                        <div class="col-md-9">
                            <p><strong>${item.name}:</strong> <span><em>${item.calories} Calories</em></span></p>
                        </div>
                        <div class="float-right col-md-3">
                            <a ><i class="fa fa-highlighter"></i>edit</a>
                        </div>
                    </div>
                </li>
                `;
            })
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getFormInput: function(){
            return{
                name: document.querySelector(UISelectors.mealName).value,
                calories: document.querySelector(UISelectors.mealCalories).value
            }
        },
        getUISelectors : function(){
            return UISelectors;
        },
        addListItem: function(item){
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <div class="row">
            <div class="col-md-9">
                <p><strong>${item.name}:</strong> <span><em>${item.calories} Calories</em></span></p>
            </div>
            <div class="float-right col-md-3">
                <a style='cursor:pointer;'><i class="fa fa-edit editItem"></i></a>
            </div>
        </div>
            `
            document.querySelector(UISelectors.itemList).appendChild(li);
            document.querySelector(UISelectors.mealName).value = '';
            document.querySelector(UISelectors.mealCalories).value = '';

        },
        updateTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).innerHTML = totalCalories;
        },
        updateItem: function(){
         document.querySelector(UISelectors.mealName).value = itemCtrl.getItem().name;
         document.querySelector(UISelectors.mealCalories).value = itemCtrl.getItem().calories;  
         document.querySelector(UISelectors.btnEdit).style.display = 'block';
         document.querySelector(UISelectors.btnBack).style.display = 'block';
         document.querySelector(UISelectors.btnDelete).style.display = 'block';
         document.querySelector(UISelectors.addBtn).style.display = 'none'; 

        },
        updateCurrentItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItem);
            listItems = Array.from(listItems);
            listItems.forEach((listItem) =>{
                const listItemId = listItem.getAttribute("id");
                const id = `item-${item.id}`;
                if(listItemId === id){
                    document.querySelector(`#${id}`).innerHTML = 
                    `
                    <div class="row">
                        <div class="col-md-9">
                            <p><strong>${item.name}:</strong> <span><em>${item.calories} Calories</em></span></p>
                        </div>
                        <div class="float-right col-md-3">
                            <a style='cursor:pointer;'><i class="fa fa-edit editItem"></i></a>
                        </div>
                    </div>
                    `
                    this.intialState();
                }
            })
        },
        deleteItem: function(id){
            const itemId = `#item-${id}`;
            document.querySelector(itemId).remove();
            this.intialState();
        },
        clearAll: function(){
            let listItems = document.querySelectorAll(UISelectors.listItem);
            listItems = Array.from(listItems);
            listItems.forEach((listItem) =>{
                listItem.remove();
            })
        }
    }   
})()
// ITEM CONTROLLER
itemCtrl = (function(){
    const item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const data = {
        items :[
            // {id:0, name: "Steak Dinner", calories: 1200},
            // {id:1, name: "Eggs", calories: 400}
        ],
        currentItem : null,
        totalCalories : 0
    }
    
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            calories = parseInt(calories);
            const newItem = new item(ID, name, calories);
            data.items.push(newItem);

            return newItem;


        },
        totalCalories: function(){
            let total = 0;
            // looping through items
            data.items.forEach((item)=>{
                total+= item.calories;
            })
            data.totalCalories = total;
            return data.totalCalories;

        },
        getCurrentItem: function(id){
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === id){
                    found = item;
                }
            })
            return found;
        },
        getItem: function(){
            return data.currentItem;
        },
        setCurrentItem: function(currentItem){
            data.currentItem = currentItem;
        },
        updateCurrentItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function(id){
            data.items.forEach((item)=>{
                if(item.id === id){
                    const index = data.items.indexOf(item);
                    data.items.splice(index,1);
                }
            })
            UICtrl.deleteItem(id);
        },
        clearAll: function(){
            data.items = [];
        },
        logData: function(){
        return data;
        }
        
    }
})()    


// APP CONTROLLER
const app = (function(itemCtrl, UICtrl){
    const UISelectors = UICtrl.getUISelectors();
    const loadEventListeners = function(){
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // calling the edit state
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
        // calling update edit state
        document.querySelector(UISelectors.btnEdit).addEventListener("click", itemUpdateSubmit);
         // calling back button
         document.querySelector(UISelectors.btnBack).addEventListener("click", UICtrl.intialState);
         // calling delete button
         document.querySelector(UISelectors.btnDelete).addEventListener("click", deleteItem);
         // calling the clear all button
         document.querySelector(UISelectors.btnClearAll).addEventListener("click", clearAll);
    }
  
    const itemAddSubmit = function(e){
        const input = UICtrl.getFormInput();
        
        if(input.name === '' || input.calories === ''){
            alert('please fill the fields');
        }else{
        const addItem = itemCtrl.addItem(input.name, input.calories);
        UICtrl.addListItem(addItem);
        const totalCalories = itemCtrl.totalCalories();
        UICtrl.updateTotalCalories(totalCalories);
        }
        e.preventDefault();
    }
    const itemEditClick = function(e){
        if(e.target.classList.contains('editItem')){
            const li = e.target.parentElement.parentElement.parentElement.parentElement;
            const id = li.getAttribute("id");
            const itemIDArr = id.split("-");
            const itemId = parseInt(itemIDArr[1]);
            const getCurrentItem = itemCtrl.getCurrentItem(itemId);
            itemCtrl.setCurrentItem(getCurrentItem);
            UICtrl.updateItem();
        }
        e.preventDefault();
       
    }
    const itemUpdateSubmit = function(e){
        const input = UICtrl.getFormInput();
        const updatedItem = itemCtrl.updateCurrentItem(input.name, input.calories);
        UICtrl.updateCurrentItem(updatedItem);
        // updating total Calories
        const totalCalories = itemCtrl.totalCalories();
        UICtrl.updateTotalCalories(totalCalories);
        e.preventDefault();
    }
    const deleteItem = function(e){
        const item = itemCtrl.getItem();
        itemCtrl.deleteItem(item.id);
        // updating total Calories
        const totalCalories = itemCtrl.totalCalories();
        UICtrl.updateTotalCalories(totalCalories);
        e.preventDefault();
    }
    const clearAll = function(e){
        itemCtrl.clearAll();
        UICtrl.clearAll();
        // updating total Calories
        const totalCalories = itemCtrl.totalCalories();
        UICtrl.updateTotalCalories(totalCalories);
        UICtrl.intialState();
        e.preventDefault();
    }
    return{
        init: function(){
            // calling the intial state
            UICtrl.intialState();
            const items = itemCtrl.getItems();
            UICtrl.populateList(items);


            // LOAD EVENT LISTENERS
            loadEventListeners();
        }
    }
})(itemCtrl, UICtrl)

app.init();

