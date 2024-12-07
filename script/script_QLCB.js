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
        addChuyenBay();
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });

    // Sự kiện nhấn nút đóng modal (X)
    closeModalButton.addEventListener('click', function() {
       modalOverlay.style.display = 'none'; // Đóng modal
       document.body.style.overflow = 'auto'; // Bật lại cuộn trang
        // Đặt lại giá trị của các ô nhập liệu
        resetForm();
        // Hiển thị nút Thêm và ẩn nút Lưu
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        // Đặt lại tiêu đề modal
        modalTitle.textContent = 'Thêm Chuyến Bay';
        formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
    });

    // Sự kiện nhấn nút lưu thay đổi
    saveButton.addEventListener('click', function() {
        //saveChuyenBay();
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });
});
function resetForm() {
    document.querySelector('select[id="MaMayBay"]').value = '';
    document.querySelector('select[id="MaHang"]').value = '';
    document.querySelector('select[id="SanBayDi"]').value = '';
    document.querySelector('select[id="SanBayDen"]').value = '';
    document.querySelector('input[id="NgayKhoiHanh"]').value = '';
    document.querySelector('input[id="GioBay"]').value = '';
    document.querySelector('input[id="GiaTien"]').value = '';
    document.querySelector('input[id="GhiChu"]').value = '';
    document.querySelector('input[id="GiaTien"]').value = '';
    document.querySelector('input[id="GhiChu"]').value = '';
    document.querySelector('input[id="NoiCatCanh"]').value = '';
    document.querySelector('input[id="NoiHaCanh"]').value = '';

}
// 2. Hàm load dữ liệu vào select
async function fetchAllData() {
    try {
        // Gửi request đến các endpoint
        const sanBayResponse = fetch('http://localhost:3000/sanbay');
        const hangMayBayResponse = fetch('http://localhost:3000/hangmaybay');
        const mayBayResponse = fetch('http://localhost:3000/maybay');

        // Chờ tất cả các request hoàn thành
        const [sanBayData, hangMayBayData, mayBayData] = await Promise.all([
            sanBayResponse.then(res => res.json()),
            hangMayBayResponse.then(res => res.json()),
            mayBayResponse.then(res => res.json()),
        ]);

        return {
            sanbay: sanBayData,
            hangmaybay: hangMayBayData,
            maybay: mayBayData,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Quăng lỗi để xử lý phía trên (nếu cần)
    }
}

// Hàm hiển thị dữ liệu lên select
function populateSelect(selectId, data, labelKey, valueKey) {
    const selectElement = document.getElementById(selectId);

    // Xóa các tùy chọn cũ (nếu có)
    selectElement.innerHTML = '<option value="">-- Chọn --</option>';

    // Thêm dữ liệu mới vào select
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        selectElement.appendChild(option);
    });
}

// Hàm chính: Lấy dữ liệu và hiển thị
async function init() {
    try {
        const { sanbay, hangmaybay, maybay } = await fetchAllData();

        // Hiển thị dữ liệu lên các select box
        populateSelect('SanBayDi', sanbay, 'TenSanBay', 'id'); // Thay 'TenSanBay' và 'ID' theo cấu trúc dữ liệu của bạn
        populateSelect('SanBayDen', sanbay, 'TenSanBay', 'id'); // Thay 'TenSanBay' và 'ID'
        populateSelect('MaHang', hangmaybay, 'TenHang', 'id'); // Thay 'TenHangMayBay' và 'ID'
        populateSelect('MaMayBay', maybay, 'TenMayBay', 'id'); // Thay 'TenMayBay' và 'ID'
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

init();



var chuyenBayAPI = 'http://localhost:3000/chuyenbay';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getChuyenBay(renderChuyenBay);
}

// Lấy danh sách sân bay -> gửi API
function getChuyenBay(callback){
    fetch(chuyenBayAPI)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error fetching chuyenbay:', error));
}

// Tạo sân bay mới -> gửi API
function createChuyenBay(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chuyenBayAPI, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating chuyenbay:', error));
}

// Xóa sân bay -> gửi API
function deleteChuyenBay(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chuyenBayAPI + '/' + id, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(){
            var chuyenBayItem = document.querySelector('.chuyenbay-item-' + id);
            if(chuyenBayItem){
                chuyenBayItem.remove();
            }
        })
        .catch(error => console.error('Error deleting chuyenbay:', error));
}

// Sửa thông tin sân bay -> gửi API
function updateChuyenBay(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chuyenBayAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating chuyenbay:', error));
}

// Hiển thị danh sách sân bay và giao diện
function renderChuyenBay(list_chuyenbay){
    var listChuyenBay = document.querySelector('tbody');
    var htmls = list_chuyenbay.map(function(chuyenbay, index) {
        return `<tr class="sanbay-item-${chuyenbay.id}">
                    <td>${index + 1}</td>
                    <td>${chuyenbay.id}</td>
                    <td>${chuyenbay.MaMayBay}</td>
                    <td>${chuyenbay.MaHang}</td>
                    <td>${chuyenbay.NoiCatCanh}</td>
                    <td>${chuyenbay.NoiHaCanh}</td>
                    <td>${chuyenbay.SanBayDi}</td>
                    <td>${chuyenbay.SanBayDen}</td>
                    <td>${chuyenbay.NgayKhoiHanh}</td>
                    <td>${chuyenbay.GioBay}</td>
                    <td>${chuyenbay.GiaTien}</td>
                    <td>${chuyenbay.GhiChu}</td>
                    <td class="edit-icons">
                        <button onclick="editChuyenBay('${chuyenbay.id}')">✎</button>
                        <button onclick="deleteChuyenBay('${chuyenbay.id}', getChuyenBay(renderChuyenBay))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');
    
    listChuyenBay.innerHTML = htmls;
}

// Hoạt động Thêm sân bay vào API và cập nhật giao diện
function addChuyenBay() {
    var MaMayBayInput = document.querySelector('select[id="MaMayBay"]');
    var MaHangInput = document.querySelector('select[id="MaHang"]');
    var SanBayDiInput = document.querySelector('select[id="SanBayDi"]');
    var SanBayDenInput = document.querySelector('select[id="SanBayDen"]');
    var NgayKhoiHanhInput = document.querySelector('input[id="NgayKhoiHanh"]');
    var GioBayInput = document.querySelector('input[id="GioBay"]');
    var GiaTienInput = document.querySelector('input[id="GiaTien"]');
    var GhiChuInput = document.querySelector('input[id="GhiChu"]');
    var NoiCatCanhInput = document.querySelector('input[id="NoiCatCanh"]');
    var NoiHaCanhInput = document.querySelector('input[id="NoiHaCanh"]');



    // Kiểm tra nếu tất cả các input tồn tại và không trống
    if (MaMayBayInput && MaHangInput && SanBayDiInput && SanBayDenInput && NgayKhoiHanhInput && GioBayInput && GiaTienInput && GhiChuInput && NoiCatCanhInput && NoiHaCanhInput) {
        var MaMayBay = MaMayBayInput.value.trim();
        var MaHang = MaHangInput.value.trim();
        var SanBayDi = SanBayDiInput.value.trim();
        var SanBayDen = SanBayDenInput.value.trim();
        var NgayKhoiHanh = NgayKhoiHanhInput.value.trim();
        var GioBay = GioBayInput.value.trim();
        var GiaTien = GiaTienInput.value.trim();
        var GhiChu = GhiChuInput.value.trim();
        var NoiCatCanh = NoiCatCanhInput.value.trim();
        var NoiHaCanh = NoiHaCanhInput.value.trim();

        if (MaMayBay === "" || MaHang === "" || SanBayDi === "" || SanBayDen === "" || NgayKhoiHanh === "" || GioBay === "" || GiaTien === "" || GhiChu === "" || NoiCatCanh === "" || NoiHaCanh === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return; // Dừng thực hiện nếu có ô trống
        }
    
        var data = {
            MaMayBay: MaMayBay,
            MaHang: MaHang,
            NoiCatCanh: NoiCatCanh,
            NoiHaCanh: NoiHaCanh,
            SanBayDi: SanBayDi,
            SanBayDen: SanBayDen,
            NgayKhoiHanh: NgayKhoiHanh,
            GioBay: GioBay,
            GiaTien: GiaTien,
            GhiChu: GhiChu
        };
    
        // Gọi hàm tạo sân bay và cập nhật danh sách sau khi thêm thành công
        createChuyenBay(data, function() {
            getChuyenBay(renderChuyenBay);  // Cập nhật danh sách sân bay
            //resetForm();
            document.querySelector('select[id="MaMayBay"]').value = '';
            document.querySelector('select[id="MaHang"]').value = '';
            document.querySelector('select[id="SanBayDi"]').value = '';
            document.querySelector('select[id="SanBayDen"]').value = '';
            document.querySelector('input[id="NgayKhoiHanh"]').value = '';
            document.querySelector('input[id="GioBay"]').value = '';
            document.querySelector('input[id="GiaTien"]').value = '';
            document.querySelector('input[id="GhiChu"]').value = '';
            document.querySelector('input[id="NoiCatCanh"]').value = '';
            document.querySelector('input[id="NoiHaCanh"]').value = '';
        });
    }

    // Kiểm tra nếu tất cả các ô nhập liệu đều có giá trị
    
}

// Hoạt động Sửa thông tin sân bay
function editChuyenBay(id) {
    fetch(chuyenBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(chuyenbays) {
            var chuyenbay = chuyenbays.find(function(c) {
                return c.id === id;
            });

            if (chuyenbay) {
                var MaMayBayInput = document.querySelector('select[id="MaMayBay"]');
                var MaHangInput = document.querySelector('select[id="MaHang"]');
                var SanBayDiInput = document.querySelector('select[id="SanBayDi"]');
                var SanBayDenInput = document.querySelector('select[id="SanBayDen"]');
                var NgayKhoiHanhInput = document.querySelector('input[id="NgayKhoiHanh"]');
                var GioBayInput = document.querySelector('input[id="GioBay"]');  
                var GiaTienInput = document.querySelector('input[id="GiaTien"]');  
                var GhiChuInput = document.querySelector('input[id="GhiChu"]');
                var NoiCatCanhInput = document.querySelector('input[id="NoiCatCanh"]');
                var NoiHaCanhInput = document.querySelector('input[id="NoiHaCanh"]');
                
                

                var themBtn = document.querySelector('#addPlaneButton');
                var formContainer = document.querySelector('#modalOverlay'); // Updated to match the modal overlay
                var saveBtn = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3'); // Tiêu đề của modal
                var formModal = document.querySelector('.modal');
                // Điền giá trị hiện tại vào các ô nhập liệu
                MaMayBayInput.value = chuyenbay.MaMayBay;
                MaHangInput.value = chuyenbay.MaHang;
                SanBayDiInput.value = chuyenbay.SanBayDi;
                SanBayDenInput.value = chuyenbay.SanBayDen;
                NgayKhoiHanhInput.value = chuyenbay.NgayKhoiHanh;
                GioBayInput.value = chuyenbay.GioBay;
                GiaTienInput.value = chuyenbay.GiaTien;
                GhiChuInput.value = chuyenbay.GhiChu;
                NoiCatCanhInput.value = chuyenbay.NoiCatCanh;
                NoiHaCanhInput.value = chuyenbay.NoiHaCanh;

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
                    var MaMayBay = MaMayBayInput.value.trim();
                    var MaHang = MaHangInput.value.trim();
                    var SanBayDi = SanBayDiInput.value.trim();
                    var SanBayDen = SanBayDenInput.value.trim();
                    var NgayKhoiHanh = NgayKhoiHanhInput.value.trim();
                    var GioBay= GioBayInput.value.trim();
                    var GiaTien = GiaTienInput.value.trim();
                    var GhiChu = GhiChuInput.value.trim();
                    var NoiCatCanh = NoiCatCanhInput.value.trim();
                    var NoiHaCanh = NoiHaCanhInput.value.trim();

                    if (MaMayBay === "" || MaHang === "" || SanBayDi === "" || SanBayDen === "" || NgayKhoiHanh === "" || GioBay === "" || GiaTien=== "" || GhiChu === "" || NoiCatCanh === "" || NoiHaCanh === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    var updatedChuyenBay = {
                        MaMayBay: MaMayBay,
                        MaHang: MaHang,
                        SanBayDi: SanBayDi,
                        SanBayDen: SanBayDen,
                        NgayKhoiHanh: NgayKhoiHanh,
                        GioBay: GioBay,
                        GiaTien: GiaTien,
                        GhiChu: GhiChu,
                        NoiCatCanh: NoiCatCanh,
                        NoiHaCanh: NoiHaCanh
                    };

                    updateChuyenBay(id, updatedChuyenBay, function() {
                        getChuyenBay(renderChuyenBay);
                        resetForm();

                        // Đặt lại tiêu đề modal
                        modalTitle.textContent = 'Thêm Chuyến Bay';
                        saveBtn.style.display = 'none'; 
                        themBtn.style.display = 'inline-block'; 
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
                        
                        // Xóa lớp edit-mode
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        })
        .catch(error => console.error('Error editing chuyenbay:', error));
}

// Tìm kiếm sân bay
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchChuyenBay(searchTerm);
        } else {
            getChuyenBay(renderChuyenBay); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });
});

function searchChuyenBay(searchTerm) {
    fetch(chuyenBayAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(chuyenbays) {
            const filteredSanbays = chuyenbays.filter(function(chuyenbay) {
                return chuyenbay.MaChuyenBay.toLowerCase().includes(searchTerm);
            });
            renderChuyenBay(filteredSanbays);
        })
        .catch(error => console.error('Error searching chuyenbay:', error));
}

