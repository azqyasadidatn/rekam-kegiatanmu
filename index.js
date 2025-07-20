let dataDaftarList = []
let currentListId=null
let listToDelate = null

document.addEventListener('DOMContentLoaded', () => {
    const storedLists = localStorage.getItem('dataDaftarList');
    if (storedLists) {
        dataDaftarList = JSON.parse(storedLists);
    }
    renderTask(); 
});
// ----------------------------

function saveDaftar() {
    localStorage.setItem('dataDaftarList', JSON.stringify(dataDaftarList));
}

function renderTask(){
    document.querySelector('.list-wrep').style.display= 'none'
    document.querySelector('.box-wrep').style.display='flex'
    document.querySelector('.wrap-atas').style.display='flex'
    const playlist = document.querySelector('.newPlaylist')
    playlist.innerHTML=''
    dataDaftarList.forEach(plylist =>{
        const box = document.createElement('div')
        box.classList.add('list-box');
        box.onclick =()=> openTaskList(plylist.id)

        const titleElemen = document.createElement('h3')
        titleElemen.textContent = plylist.nama

        const taskCaunt = document.createElement('p')
        taskCaunt.textContent =`${plylist.tasks.length} Tugas`

        const delatePlaylistBtn = document.createElement('button')
        delatePlaylistBtn.textContent = 'X'
        delatePlaylistBtn.onclick = (e) =>{
            e.stopPropagation()
            showConfirmModal(plylist.id)
        }
        box.appendChild(titleElemen)
        box.appendChild(taskCaunt)
        box.appendChild(delatePlaylistBtn)
        playlist.appendChild(box)
        
    })

}
function addNewPlylist(){
    const inputNama = document.querySelector('#name')
    const dataDaftar = inputNama.value.trim()
    if(dataDaftar){
        dataDaftarList.push(
            { 
                id : Date.now(),
                nama : dataDaftar , 
                tasks : []
            })
        inputNama.value=""
        saveDaftar()
        renderTask()
    } else{
        alert('Data tidak ada ')
    }
}

function showConfirmModal(plylistId){
    listToDelate= plylistId
    document.getElementById('confirmModal').style.display= 'flex'
}
function hideConfirmModal(){
    document.getElementById('confirmModal').style.display='none'
    listToDelate= null
}
function confirmDelateAction(){
    if(listToDelate !== null){
        dataDaftarList = dataDaftarList.filter(plylist => plylist.id !== listToDelate)
        renderTask()
        saveDaftar()
    }
    hideConfirmModal()
}

document.getElementById('modalConfirmBtn').onclick = confirmDelateAction
document.getElementById('modalCancelBtn').onclick = hideConfirmModal

function openTaskList(plylistId){
    currentListId = plylistId
    document.querySelector('.list-wrep').style.display='flex'
    document.querySelector('.box-wrep').style.display= 'none'
    document.querySelector('.wrap-atas').style.display='none'
    renderWeb()
}
function backTo(){
    currentListId = null
    renderTask()
}



//====== TASK==========

function activity(){
    const input = document.querySelector('#text')
    const data = input.value.trim()
    if(data && currentListId !== null){
        const activeList = dataDaftarList.find(plylist => plylist.id === currentListId); //mengidentifikasi dan mendapatkan akses ke objek daftar yang benar 
        if(activeList){
        activeList.tasks.push({task: data, keterangan :false})
        input.value=""
        saveDaftar()
        renderWeb()
        }
    } else if(!data){
        alert("Data tidak ada")
    } else{
        alert("Pilih Daftar tugas terlebih dahulu")
    }
}
function renderWeb(){
    const listKegiatan = document.querySelector('#listTugas')
    listKegiatan.innerHTML=""
    const activeList = dataDaftarList.find(list => list.id === currentListId);

    if (activeList && activeList.tasks) {
        activeList.tasks.forEach(function(masuk,item){
            const list = document.createElement('div')
            list.classList.add('task-item')

    if(masuk.keterangan === true){
        list.classList.add('after-selesai')
    }
    const newteks = document.createElement('span')
    newteks.textContent= masuk.task;
    list.appendChild(newteks)

    // tombol tambahan
    const grupButton=document.createElement('div');
    grupButton.classList.add('button-group')

    const deleteButton=document.createElement('button')
    deleteButton.textContent= 'X';
    deleteButton.onclick = function(){
        deletList(item);
    }
    const selesaiButton=document.createElement('button')
    selesaiButton.textContent='✓';
    selesaiButton.onclick =function(){
        finishButton(item)
    }
    grupButton.appendChild(deleteButton);
    grupButton.appendChild(selesaiButton);

    list.appendChild(grupButton);
    listKegiatan.appendChild(list);
    })
}
}
function deletList(item){
    const activeList = dataDaftarList.find(list => list.id === currentListId);
    if(activeList){
        activeList.tasks.splice(item,1)
    }
    renderWeb()
    saveDaftar()
}
function finishButton(item){
    const activeList = dataDaftarList.find(list => list.id === currentListId);
    if(activeList){
        activeList.tasks[item].keterangan=!activeList.tasks[item].keterangan
    }
    renderWeb()
    saveDaftar()
}
