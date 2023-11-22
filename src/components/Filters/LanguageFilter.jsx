// import React from 'react';
// import styles from './filters.module.css'; // Ensure you have the corresponding CSS file

// const LanguageFilter = ({ onLanguageSelect, selectedLanguages }) => {
//   // This would be the list of languages you want to show in your filter.
//   // You would typically load these from a backend service or define them statically.
//   const languages = ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'Go'];

//   const handleLanguageChange = (event) => {
//     const { value, checked } = event.target;
//     onLanguageSelect(value, checked);
//   };

//   return (
//     <div className={styles.languageFilter}>
//       <h3>Languages</h3>
//       {languages.map((language) => (
//         <div key={language}>
//           <input
//             type="checkbox"
//             id={`language-${language}`}
//             name="languages"
//             value={language}
//             checked={selectedLanguages.includes(language)}
//             onChange={handleLanguageChange}
//           />
//           <label htmlFor={`language-${language}`}>{language}</label>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LanguageFilter;
