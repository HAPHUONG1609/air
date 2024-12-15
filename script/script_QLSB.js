document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addPlaneButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton'); // Nút đóng modal
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');

    // Thiết lập sự kiện nhấn nút mở modal
    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
        document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
    });

    // Thiết lập sự kiện nhấn nút thêm chuyến bay
    addPlaneButton.addEventListener('click', function() {  
        addSanBay();
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });

    // Sự kiện nhấn nút đóng modal (X)
    closeModalButton.addEventListener('click', function() {
       modalOverlay.style.display = 'none'; // Đóng modal
       document.body.style.overflow = 'auto'; // Bật lại cuộn trang
        // Đặt lại giá trị của các ô nhập liệu
        document.querySelector('input[id="TenSanBay"]').value = '';
        document.querySelector('input[id="ThanhPho"]').value = '';
        document.querySelector('input[id="QuocGia"]').value = '';

        // Đặt lại trạng thái hiển thị của các nút
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
  // Đặt lại tiêu đề modal
        modalTitle.textContent = 'Thêm Máy Bay';
        formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
    });

    // Sự kiện nhấn nút lưu thay đổi
    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });
});

var sanBayAPI = 'http://localhost:3000/sanbay';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getSanBay(renderSanBay);
}

// Lấy danh sách sân bay -> gửi API
function getSanBay(callback){
    fetch(sanBayAPI)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}

// Tạo sân bay mới -> gửi API
function createSanBay(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(sanBayAPI, options)
        .then(function(response){
            return response.json();
        })
        .then(callback);
}

// Xóa sân bay -> gửi API
function deleteSanBay(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(sanBayAPI + '/' + id, options)
        .then(function(response){
            return response.json();
        })
        .then(function(){
            var sanBayItem = document.querySelector('.sanbay-item-' + id);
            if(sanBayItem){
                sanBayItem.remove();
            }
        });
}

// Sửa thông tin sân bay -> gửi API
function updateSanBay(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(sanBayAPI + '/' + id, options)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

// Hiển thị danh sách sân bay và giao diện
function renderSanBay(list_sanbay){
    var listSanBay = document.querySelector('tbody');
    var htmls = list_sanbay.map(function(sanbay, index) {
        return `<tr class="sanbay-item-${sanbay.id}">
                    <td>${index + 1}</td>
                    <td>${sanbay.id}</td>
                    <td>${sanbay.TenSanBay}</td>
                    <td>${sanbay.ThanhPho}</td>
                    <td>${sanbay.QuocGia}</td>
                    <td class="edit-icons">
                        <button onclick="editSanBay('${sanbay.id}')">✎</button>
                        <button onclick="deleteSanBay('${sanbay.id}', getSanBay(renderSanBay))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');
    
    listSanBay.innerHTML = htmls;
}

// Hoạt động Thêm sân bay vào API và cập nhật giao diện
function addSanBay() {
    var TenSanBayInput = document.querySelector('input[id="TenSanBay"]');
    var ThanhPhoInput = document.querySelector('input[id="ThanhPho"]');
    var QuocGiaInput = document.querySelector('input[id="QuocGia"]');

    // Kiểm tra nếu tất cả các input tồn tại và không trống
    if (TenSanBayInput && ThanhPhoInput && QuocGiaInput) {
        var TenSanBay = TenSanBayInput.value.trim();
        var ThanhPho = ThanhPhoInput.value.trim();
        var QuocGia = QuocGiaInput.value.trim();

        // Kiểm tra nếu tất cả các ô nhập liệu đều có giá trị
        if (TenSanBay === "" || ThanhPho === "" || QuocGia === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return; // Dừng thực hiện nếu có ô trống


        }

        var data = {
            TenSanBay: TenSanBay,
            ThanhPho: ThanhPho,
            QuocGia: QuocGia
        };

        // Gọi hàm tạo sân bay và cập nhật danh sách sau khi thêm thành công
        createSanBay(data, function() {
            getSanBay(renderSanBay);  // Cập nhật danh sách sân bay
           
            // Đặt lại giá trị của các ô nhập liệu
            TenSanBayInput.value = '';
            ThanhPhoInput.value = '';
            QuocGiaInput.value = '';

            



        });
    } 
}

// Hoạt động Sửa thông tin sân bay
function editSanBay(id) {
    fetch(sanBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(sanbays) {
            var sanbay = sanbays.find(function(s) {
                return s.id === id;
            });

            if (sanbay) {
                var TenSanBayInput = document.querySelector('input[id="TenSanBay"]');
                var ThanhPhoInput = document.querySelector('input[id="ThanhPho"]');
                var QuocGiaInput = document.querySelector('input[id="QuocGia"]');
                var themBtn = document.querySelector('#addPlaneButton');
                var formContainer = document.querySelector('#modalOverlay'); // Updated to match the modal overlay
                var saveBtn = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3'); // Tiêu đề của modal
                var formModal = document.querySelector('.modal');
                // Điền giá trị hiện tại vào các ô nhập liệu
                TenSanBayInput.value = sanbay.TenSanBay;
                ThanhPhoInput.value = sanbay.ThanhPho;
                QuocGiaInput.value = sanbay.QuocGia;

                // Thay đổi tiêu đề modal
                modalTitle.textContent = 'Chỉnh sửa';
                formModal.style.backgroundColor = '#e8f5e9'; // Màu nền xanh nhạt

               

                // Hiển thị modal và ẩn nút Thêm
                formContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
                themBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';

                // Thêm sự kiện cho nút lưu thay đổi
                saveBtn.onclick = function() {
                    var TenSanBay = TenSanBayInput.value.trim();
                    var ThanhPho = ThanhPhoInput.value.trim();
                    var QuocGia = QuocGiaInput.value.trim();

                    if (TenSanBay === "" || ThanhPho === "" || QuocGia === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    var updatedSanBay = {
                        TenSanBay: TenSanBay,
                        ThanhPho: ThanhPho,
                        QuocGia: QuocGia
                    };

                    updateSanBay(id, updatedSanBay, function() {
                        getSanBay(renderSanBay);
                        TenSanBayInput.value = '';
                        ThanhPhoInput.value = '';
                        QuocGiaInput.value = '';
                        // Đặt lại tiêu đề modal
                        modalTitle.textContent = 'Thêm Máy Bay';
                        saveBtn.style.display = 'none'; 
                        themBtn.style.display = 'inline-block'; 
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
                        
                        // Xóa lớp edit-mode
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        });
}

// Tìm kiếm sân bay
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchSanBay(searchTerm);
        } else {
            getSanBay(renderSanBay); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });    
    
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getSanBay(renderSanBay); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });
});

function searchSanBay(searchTerm) {
    fetch(sanBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(sanbays) {
            const filteredSanbays = sanbays.filter(function(sanbay) {
                return sanbay.TenSanBay.toLowerCase().includes(searchTerm);
            });
            renderSanBay(filteredSanbays);
        });
}

