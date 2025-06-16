<template>
  <div class="q-pa-md">
    <!-- 关于数据库主卡片 -->
    <q-card flat bordered class="about-card">
      <q-card-section>
        <h2 class="text-center">About RNA Pesticide Database</h2>
        <q-separator class="q-my-md" />

        <!-- 数据库使命 -->
        <div class="mission-section">
          <q-icon name="mdi-bullseye-arrow" size="lg" color="primary" />
          <h3>Our Mission</h3>
          <p>
            The RNA Pesticide Database is committed to becoming the world's most comprehensive RNA interference pesticide information resource platform to promote the sustainable development of green agriculture. We integrate RNAi pesticide data from scientific research institutions around the world to provide scientific decision-making support for researchers, agricultural companies and policy makers.
          </p>
        </div>

        <!-- 数据库特点 -->
        <div class="features-section">
          <h3>Database features</h3>
          <div class="features-grid">
            <div class="feature-item">
              <q-icon name="mdi-database" size="md" />
              <h4>Comprehensive data</h4>
              <p>Contains more than****** RNAi target data, covering***+agricultural pests</p>
            </div>
            <div class="feature-item">
              <q-icon name="mdi-update" size="md" />
              <h4>Regularly updated</h4>
              <p>Update data annually to track the latest research results and field trials</p>
            </div>
            <div class="feature-item">
              <q-icon name="mdi-magnify" size="md" />
              <h4>Smart search</h4>
              <p>Supports multiple condition screening and BLAST sequence alignment</p>
            </div>
            <div class="feature-item">
              <q-icon name="mdi-open-source-initiative" size="md" />
              <h4>Open sharing</h4>
              <p>部分数据开放获取，促进学术交流</p>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 团队介绍卡片 -->
    <q-card flat bordered class="about-card team-section">
      <q-card-section>
        <h3>Our team</h3>
        <q-separator class="q-my-md" />
        <div class="team-members">
          <!-- 团队成员1 -->
          <div class="member-card">
            <q-avatar size="100px">
              <img src="images/team1.jpg" alt="郑教授" />
            </q-avatar>
            <h4>Zheng Lingling</h4>
            <p class="position">chief scientist</p>
            <p>
              RNA Information Center, State Key Laboratory for Biocontrol, Sun Yat-sen University,
              Guangzhou 510275, P. R. China
            </p>
            <p>zhengll33@mail.sysu.edu.cn</p>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- 工具卡片 -->
    <q-card flat bordered class="about-card">
      <q-card-section>
        <h3>Our Tools</h3>
        <q-separator class="q-my-md" />

        <div class="partners-grid">
          <div class="partner-logo">
            <img src="images/partner1.png" alt="PubMed" />
          </div>
          <div class="partner-logo">
            <img src="images/partner2.png" alt="quasar" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 联系方式卡片 -->
    <q-card flat bordered class="about-card contact-section">
      <q-card-section>
        <h3>Contact us</h3>
        <q-separator class="q-my-md" />

        <div class="contact-methods">
          <div class="contact-item">
            <q-icon name="mdi-email" size="md" />
            <p>Mail: zhengchx28@mail2.sysu.edu.cn.</p>
          </div>
          <div class="contact-item">
            <q-icon name="mdi-phone" size="md" />
            <p>Telephone: +86 10 12345678</p>
          </div>
          <div class="contact-item">
            <q-icon name="mdi-map-marker" size="md" />
            <p>Address: Room 317, Zengxianzi North Campus, Sun Yat-sen University, Haizhu District, Guangzhou</p>
          </div>
          <div class="contact-item">
            <q-icon name="mdi-clock" size="md" />
            <p>Working hours: Monday to Friday 9:00-17:00</p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutPage',
  data() {
    return {
      // 可以添加响应式数据
    }
  },
})
</script>

<style scoped>
.about-card {
  margin: 20px auto;
  width: 80%;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #1d78b1;
  font-size: 2rem;
  margin-bottom: 20px;
}

h3 {
  color: #1d78b1;
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #7c9eac;
  padding-bottom: 8px;
}

h4 {
  color: #285bc2;
  margin: 10px 0;
}

p {
  color: #555555;
  line-height: 1.6;
}

.mission-section {
  text-align: center;
  padding: 20px;
  margin-bottom: 30px;
}

.mission-section h3 {
  margin: 15px 0;
}

.features-section {
  margin: 30px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.team-section {
  background-color: #ecf3f9;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.member-card {
  text-align: center;
  padding: 20px;
}

.member-card .position {
  color: #1971b4;
  font-weight: bold;
  margin: 5px 0;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  align-items: center;
  justify-items: center;
  padding: 20px 0;
}

.partner-logo img {
  max-width: 150px;
  max-height: 80px;
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.partner-logo:hover img {
  filter: grayscale(0%);
}

.contact-section {
  background-color: #ecf3f9;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .about-card {
    width: 95%;
  }

  .features-grid,
  .team-members,
  .contact-methods {
    grid-template-columns: 1fr;
  }
}
</style>
