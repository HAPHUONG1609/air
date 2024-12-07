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

    // Thiết lập sự kiện nhấn nút thêm hãng bay
    addPlaneButton.addEventListener('click', function() {  
        addHangBay();
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });

    // Sự kiện nhấn nút đóng modal (X)
    closeModalButton.addEventListener('click', function() {
       modalOverlay.style.display = 'none'; // Đóng modal
       document.body.style.overflow = 'auto'; // Bật lại cuộn trang
        // Đặt lại giá trị của các ô nhập liệu
        document.querySelector('input[id="TenHang"]').value = '';
        document.querySelector('input[id="ThanhPho"]').value = '';
        document.querySelector('input[id="QuocGia"]').value = '';

        // Đặt lại trạng thái hiển thị của các nút
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
  // Đặt lại tiêu đề modal
        modalTitle.textContent = 'Thêm Hãng Bay';
        formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
    });
});

var hangBayAPI = 'http://localhost:3000/hangmaybay';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getHangBay(renderHangBay);
}

// Lấy danh sách sân bay -> gửi API
function getHangBay(callback){
    fetch(hangBayAPI)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}

// Tạo hang bay mới -> gửi API
function createHangBay(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(hangBayAPI, options)
    .then(function(response){
        return response.json();
    })
    .then(callback)
    .catch(function(error) {
        console.error('Lỗi khi lấy dữ liệu từ hangBayAPI:', error);
    });
}

// Xóa hang bay -> gửi API
function deleteHangBay(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(hangBayAPI + '/' + id, options)
        .then(function(response){
            return response.json();
        })
        .then(function(){
            var hangBayItem = document.querySelector('.hangbay-item-' + id);
            if(hangBayItem){
                hangBayItem.remove();
            }
        });
}

// Sửa thông tin hang bay -> gửi API
function updateHangBay(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(hangBayAPI + '/' + id, options)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

// Hiển thị danh sách hãng bay và giao diện 

function renderHangBay(list_hangbay) {
    var listHangBay = document.querySelector('tbody');
    var htmls = list_hangbay.map(function(hangbay, index) {
        return `<tr class="hangbay-item-${hangbay.id}">
                    <td>${index + 1}</td>
                    <td>${hangbay.id}</td>
                    <td>${hangbay.TenHang}</td>
                    <td>${hangbay.ThanhPho}</td>
                    <td>${hangbay.QuocGia}</td>
                    <td class="edit-icons">
                        <button onclick="editHangBay('${hangbay.id}')">✎</button>
                        <button onclick="deleteHangBay('${hangbay.id}', getHangBay(renderHangBay))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');
    
    listHangBay.innerHTML = htmls;
}

// Hoạt động Thêm hãng bay vào API và cập nhật giao diện
function addHangBay() {
    var TenHangInput = document.querySelector('input[id="TenHang"]');
    var ThanhPhoInput = document.querySelector('input[id="ThanhPho"]');
    var QuocGiaInput = document.querySelector('input[id="QuocGia"]');

    // Kiểm tra nếu tất cả các input tồn tại và không trống
    if (TenHangInput && ThanhPhoInput && QuocGiaInput) {
        var TenHang = TenHangInput.value.trim();
        var ThanhPho = ThanhPhoInput.value.trim();
        var QuocGia = QuocGiaInput.value.trim();

        // Kiểm tra nếu tất cả các ô nhập liệu đều có giá trị
        if (TenHang === "" || ThanhPho === "" || QuocGia === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return; // Dừng thực hiện nếu có ô trống
        }

        var data = {
            TenHang: TenHang,
            ThanhPho: ThanhPho,
            QuocGia: QuocGia
        };

        // Gọi hàm tạo hãng bay và cập nhật danh sách sau khi thêm thành công
        createHangBay(data, function() {
            getHangBay(renderHangBay);  // Cập nhật danh sách hãng bay
            
            // Đặt lại giá trị của các ô nhập liệu
            TenHangInput.value = '';
            ThanhPhoInput.value = '';
            QuocGiaInput.value = '';
        });
    }
}

// Hoạt động Sửa thông tin hãng bay
function editHangBay(id) {
    fetch(hangBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(hangbays) {
            var hangbay = hangbays.find(function(h) {
                return h.id === id;
            });

            if (hangbay) {
                var TenHangInput = document.querySelector('input[id="TenHang"]');
                var ThanhPhoInput = document.querySelector('input[id="ThanhPho"]');
                var QuocGiaInput = document.querySelector('input[id="QuocGia"]');
                var themBtn = document.querySelector('#addPlaneButton');
                var formContainer = document.querySelector('#modalOverlay');
                var saveBtn = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                // Điền giá trị hiện tại vào các ô nhập liệu
                TenHangInput.value = hangbay.TenHang;
                ThanhPhoInput.value = hangbay.ThanhPho;
                QuocGiaInput.value = hangbay.QuocGia;

                // Thay đổi tiêu đề modal
                modalTitle.textContent = 'Chỉnh sửa';
                formModal.style.backgroundColor = '#e8f5e9';

                // Hiển thị modal và ẩn nút Thêm
                formContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                themBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';

                // Thêm sự kiện cho nút lưu thay đổi
                saveBtn.onclick = function() {
                    var TenHang = TenHangInput.value.trim();
                    var ThanhPho = ThanhPhoInput.value.trim();
                    var QuocGia = QuocGiaInput.value.trim();

                    if (TenHang === "" || ThanhPho === "" || QuocGia === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    var updatedHangBay = {
                        TenHang: TenHang,
                        ThanhPho: ThanhPho,
                        QuocGia: QuocGia
                    };

                    updateHangBay(id, updatedHangBay, function() {
                        getHangBay(renderHangBay);
                        TenHangInput.value = '';
                        ThanhPhoInput.value = '';
                        QuocGiaInput.value = '';

                        // Đặt lại tiêu đề modal
                        modalTitle.textContent = 'Thêm Hãng Bay';
                        saveBtn.style.display = 'none';
                        themBtn.style.display = 'inline-block';
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto';

                        // Xóa lớp edit-mode
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        });
}


// Tìm kiếm hãng bay
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchHangBay(searchTerm);
        } else {
            getHangBay(renderHangBay);
        }
    });    
    
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getHangBay(renderHangBay);
        }
    });
});

function searchHangBay(searchTerm) {
    fetch(hangBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(hangbays) {
            const filteredHangbays = hangbays.filter(function(hangbay) {
                return hangbay.TenHang.toLowerCase().includes(searchTerm);
            });
            renderHangBay(filteredHangbays);
        });
}