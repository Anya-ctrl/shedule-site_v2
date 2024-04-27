document.addEventListener('DOMContentLoaded', function() {
    const facultySelect = document.getElementById('facultySelect');
    const specialitySelect = document.getElementById('specialitySelect');
    const courseSelect = document.getElementById('courseSelect');
    const groupSelect = document.getElementById('groupSelect');
  
    const facultyOptionDefault  = '<option class="selection-block__option" value="" disabled  selected>Выберите факультет</option>';
    const specialityOptionDefault = '<option class="selection-block__option" value="" disabled  selected>Выберите специальность</option>';
    const courseOptionDefault = '<option class="selection-block__option" value="" disabled  selected>Выберите курс</option>';
    const groupOptionDefault = '<option class="selection-block__option" value="" disabled  selected>Выберите группу</option>';
  
    // Функция для заполнения селекта опциями
    function populateSelect(selectElement, defaultOption, dataArray, valueKey, textKey) {
      selectElement.innerHTML = defaultOption;
       dataArray.forEach(dataItem => {
          const option = document.createElement('option');
          option.value = dataItem[valueKey];
          option.textContent = dataItem[textKey];
          selectElement.appendChild(option);
       });
    }
  
    // Fetch faculties
    fetch('/faculties')
       .then(response => response.json())
       .then(data => {
          populateSelect(facultySelect, facultyOptionDefault, data, 'faculty_id', 'faculty');
       })
       .catch(error => console.error('Error fetching faculties:', error));
  
    // Handle change event for faculty select
    facultySelect.addEventListener('change', function() {
       const facultyId = this.value;
  
       if (facultyId) {
          fetch(`/specialities/${facultyId}`)
            .then(response => response.json())
            .then(data => {
               if (Array.isArray(data)) {
                  populateSelect(specialitySelect, specialityOptionDefault, data, 'speciality_id', 'speciality');
               } else {
                  console.error('Data received is not an array:', data);
               }
            })
            .catch(error => console.error('Error fetching specialities:', error));
       }
    });
  
    // Handle change event for speciality select
    specialitySelect.addEventListener('change', function() {
       const specialityId = this.value;
  
       if (specialityId) {
          fetch('/courses')
            .then(response => response.json())
            .then(data => {
               if (Array.isArray(data)) {
                  populateSelect(courseSelect, courseOptionDefault, data, 'course_id', 'course');
                  courseSelect.disabled = false;
               }
            })
            .catch(error => console.error('Error fetching courses:', error));
       }
    });
  
    // Handle change event for course select
    courseSelect.addEventListener('change', fetchGroups);
  
    function fetchGroups() {
       const specialityId = specialitySelect.value;
       const courseId = courseSelect.value;
  
       if (specialityId && courseId) {
          fetch(`/groups/${specialityId}/${courseId}`)
            .then(response => response.json())
            .then(data => {
               if (Array.isArray(data)) {
                  populateSelect(groupSelect, groupOptionDefault, data, 'group_id', 'group_name');
                  groupSelect.disabled = false;
               }
            })
            .catch(error => console.error('Error fetching groups:', error));
       }
    }
  
    // Обработка нажатия кнопки "Перейти до розкладу"
    document.getElementById('scheduleLink').addEventListener('click', function() {
       const groupId = document.getElementById('groupSelect').value; 
       if (groupId) {
          window.location.href = `/shedule/${groupId}`; 
       }
    });
    
    facultySelect.dispatchEvent(new Event('change'));
});
  
